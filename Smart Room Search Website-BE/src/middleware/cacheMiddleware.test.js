import { describe, it, expect, vi, beforeEach } from 'vitest';
import { cacheRoomsMiddleware, clearRoomsCache } from './cacheMiddleware.js';

describe('cacheRoomsMiddleware', () => {
  beforeEach(() => {
    clearRoomsCache();
  });

  it('sets X-Cache MISS on first request and HIT on subsequent request', () => {
    const middleware = cacheRoomsMiddleware(60000);
    const mockData = [{ id: 1, title: 'Phòng Quận 1' }];

    // Request 1: MISS
    const req1 = { method: 'GET', originalUrl: '/api/rooms?district=Qu%E1%BA%ADn%201' };
    const res1Headers = {};
    const res1 = {
      statusCode: 200,
      setHeader: (k, v) => { res1Headers[k] = v; },
      json: function (data) { return data; },
    };
    const next1 = vi.fn();

    middleware(req1, res1, next1);
    expect(res1Headers['X-Cache']).toBe('MISS');
    expect(next1).toHaveBeenCalled();

    // Trigger json capture
    res1.json(mockData);

    // Request 2: HIT
    const req2 = { method: 'GET', originalUrl: '/api/rooms?district=Qu%E1%BA%ADn%201' };
    const res2Headers = {};
    let sentBody = null;
    let sentStatus = null;
    const res2 = {
      setHeader: (k, v) => { res2Headers[k] = v; },
      status: (code) => {
        sentStatus = code;
        return {
          send: (body) => { sentBody = body; },
        };
      },
    };
    const next2 = vi.fn();

    middleware(req2, res2, next2);
    expect(res2Headers['X-Cache']).toBe('HIT');
    expect(sentStatus).toBe(200);
    expect(JSON.parse(sentBody)).toEqual(mockData);
    expect(next2).not.toHaveBeenCalled();
  });

  it('clears cache when clearRoomsCache is called', () => {
    const middleware = cacheRoomsMiddleware(60000);
    const req1 = { method: 'GET', originalUrl: '/api/rooms' };
    const res1Headers = {};
    const res1 = {
      statusCode: 200,
      setHeader: (k, v) => { res1Headers[k] = v; },
      json: function (data) { return data; },
    };
    middleware(req1, res1, () => {});
    res1.json([{ id: 1 }]);

    clearRoomsCache();

    // Subsequent request should be MISS again after clear
    const req2 = { method: 'GET', originalUrl: '/api/rooms' };
    const res2Headers = {};
    const res2 = {
      statusCode: 200,
      setHeader: (k, v) => { res2Headers[k] = v; },
      json: function (data) { return data; },
    };
    const next2 = vi.fn();
    middleware(req2, res2, next2);

    expect(res2Headers['X-Cache']).toBe('MISS');
    expect(next2).toHaveBeenCalled();
  });
});
