import { describe, it, expect } from 'vitest';
import { parseMoney, parseRoomsText } from './roomParser.js';

describe('roomParser', () => {
  describe('parseMoney', () => {
    it('parses million formats correctly', () => {
      expect(parseMoney('4tr2').value).toBe(4200000);
      expect(parseMoney('4.5 triệu').value).toBe(4500000);
      expect(parseMoney('3,5tr').value).toBe(3500000);
      expect(parseMoney('5 triệu').value).toBe(5000000);
    });

    it('parses thousand (k) formats correctly', () => {
      expect(parseMoney('500k').value).toBe(500000);
      expect(parseMoney('3500k').value).toBe(3500000);
      expect(parseMoney('100 nghìn').value).toBe(100000);
    });

    it('parses raw formatted numbers correctly', () => {
      expect(parseMoney('3.500.000đ').value).toBe(3500000);
      expect(parseMoney('4,000,000').value).toBe(4000000);
    });

    it('returns null for empty or invalid input', () => {
      expect(parseMoney('').value).toBeNull();
      expect(parseMoney('invalid').value).toBeNull();
    });
  });

  describe('parseRoomsText', () => {
    it('parses a full natural room description text', () => {
      const input = `Phòng P101 - Cho thuê phòng trọ Quận 10
Địa chỉ: 123 Lý Thường Kiệt, Quận 10
Giá: 4.5 triệu
Diện tích 25m2
Điện 3.5k/kwh, nước 100k/người
SĐT: 0901234567`;

      const result = parseRoomsText(input);
      expect(result).toBeDefined();
      expect(result.rooms.length).toBeGreaterThan(0);
      const parsedRoom = result.rooms[0];
      expect(parsedRoom.district).toBe('Quận 10');
      expect(parsedRoom.price).toBe(4500000);
      expect(parsedRoom.area).toBe(25);
    });
  });
});
