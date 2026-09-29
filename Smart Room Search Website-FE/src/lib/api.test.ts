import { describe, it, expect } from 'vitest';
import { normalizeApiBase } from './api';

describe('FE API utils', () => {
  describe('normalizeApiBase', () => {
    it('appends /api if missing from custom base URL', () => {
      expect(normalizeApiBase('https://smart-room.vercel.app')).toBe('https://smart-room.vercel.app/api');
      expect(normalizeApiBase('http://localhost:4000/')).toBe('http://localhost:4000/api');
    });

    it('retains /api if already included', () => {
      expect(normalizeApiBase('https://smart-room.vercel.app/api')).toBe('https://smart-room.vercel.app/api');
    });
  });
});
