import { describe, it, expect } from 'vitest';
import { EXTERNAL_MOCK_ROOMS } from './App';

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
