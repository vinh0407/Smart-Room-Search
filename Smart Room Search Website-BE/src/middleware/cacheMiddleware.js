/**
 * In-Memory Caching Middleware for Public GET /api/rooms
 * Includes automatic cache invalidation on room mutation events.
 */

const roomsCache = new Map();
const DEFAULT_TTL_MS = 60 * 1000; // 60 seconds

export const cacheRoomsMiddleware = (ttlMs = DEFAULT_TTL_MS) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = req.originalUrl || req.url;
    const now = Date.now();
    const cached = roomsCache.get(key);

    // Cache HIT
    if (cached && cached.expiresAt > now) {
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('Cache-Control', `public, max-age=${Math.floor(ttlMs / 1000)}, s-maxage=300`);
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).send(cached.body);
    }

    // Cache MISS: intercept res.json
    res.setHeader('X-Cache', 'MISS');
    res.setHeader('Cache-Control', `public, max-age=${Math.floor(ttlMs / 1000)}, s-maxage=300`);

    const originalJson = res.json.bind(res);
    res.json = (body) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        roomsCache.set(key, {
          body: JSON.stringify(body),
          expiresAt: Date.now() + ttlMs,
        });
      }
      return originalJson(body);
    };

    next();
  };
};

/**
 * Invalidate all cached room listings when room data changes (add, edit, delete, status change)
 */
export const clearRoomsCache = () => {
  roomsCache.clear();
};
