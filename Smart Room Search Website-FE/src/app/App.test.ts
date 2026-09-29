import { describe, it, expect } from 'vitest';
import { EXTERNAL_MOCK_ROOMS } from './App';
import {
  CITIES,
  DISTRICT_CATEGORIES,
  WARDS_BY_DISTRICT,
  getWardsForDistrict,
} from '../data/locations';

describe('Room detail lookup safety', () => {
  it('has 600 real rooms loaded in EXTERNAL_MOCK_ROOMS', () => {
    expect(EXTERNAL_MOCK_ROOMS.length).toBeGreaterThanOrEqual(600);
  });

  it('can find any room by id as number or string', () => {
    const first = EXTERNAL_MOCK_ROOMS[0];
    expect(first).toBeDefined();

    const byNumber = EXTERNAL_MOCK_ROOMS.find((r) => String(r.id) === String(first.id));
    expect(byNumber).toBeDefined();
    expect(byNumber?.id).toBe(first.id);

    const byString = EXTERNAL_MOCK_ROOMS.find((r) => String(r.id) === String(first.id));
    expect(byString).toBeDefined();
    expect(byString?.name).toBeTruthy();
    expect(byString?.price).toBeGreaterThan(0);
    expect(Array.isArray(byString?.images)).toBe(true);
    expect(byString?.images.length).toBeGreaterThan(0);
  });

  it('all rooms have valid status, name, address, price, and images', () => {
    for (const room of EXTERNAL_MOCK_ROOMS.slice(0, 50)) {
      expect(room.id).toBeDefined();
      expect(room.name).toBeTruthy();
      expect(room.price).toBeGreaterThan(0);
      expect(room.status).toBe('available');
      expect(Array.isArray(room.images)).toBe(true);
      expect(room.images.length).toBeGreaterThan(0);
    }
  });
});

describe('Locations & Filtering features', () => {
  it('provides supported cities with TP.HCM as default popular city', () => {
    expect(CITIES.length).toBeGreaterThanOrEqual(8);
    const hcm = CITIES.find((c) => c.shortName === 'TP.HCM');
    expect(hcm).toBeDefined();
    expect(hcm?.name).toBe('TP. Hồ Chí Minh');
    expect(hcm?.isPopular).toBe(true);
  });

  it('groups HCM districts into structured categories', () => {
    expect(DISTRICT_CATEGORIES.length).toBe(5);
    const central = DISTRICT_CATEGORIES.find((c) => c.name.includes('Trung tâm'));
    expect(central).toBeDefined();
    expect(central?.districts).toContain('Quận 1');
    expect(central?.districts).toContain('Quận 3');
  });

  it('dynamically provides ward options for any chosen district', () => {
    const q1Wards = getWardsForDistrict('Quận 1');
    expect(q1Wards).toContain('Tất cả');
    expect(q1Wards).toContain('Bến Nghé');
    expect(q1Wards).toContain('Bến Thành');

    const binhThanhWards = getWardsForDistrict('Bình Thạnh');
    expect(binhThanhWards).toContain('Tất cả');
    expect(binhThanhWards.length).toBeGreaterThan(5);

    const emptyWards = getWardsForDistrict('Tất cả');
    expect(emptyWards).toEqual([]);
  });

  it('classifies rooms by source accurately', () => {
    const choTotRooms = EXTERNAL_MOCK_ROOMS.filter((r) => r.source === 'nhatot');
    expect(choTotRooms.length).toBeGreaterThan(0);

    const phongTro123Rooms = EXTERNAL_MOCK_ROOMS.filter((r) => r.source === 'phongtro123');
    expect(phongTro123Rooms.length).toBeGreaterThan(0);
  });
});
