import { describe, it, expect, vi } from 'vitest';
import jwt from 'jsonwebtoken';
import { authenticate, requireAdmin } from './auth.js';

describe('auth middleware', () => {
  describe('authenticate', () => {
    it('returns 401 when authorization header is missing', () => {
      const req = { headers: {} };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };
      const next = vi.fn();

      authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Token không hợp lệ' });
      expect(next).not.toHaveBeenCalled();
    });

    it('authenticates valid Bearer token', () => {
      const secret = 'super-secret-key-for-test-32chars!!';
      process.env.JWT_SECRET = secret;
      const token = jwt.sign({ id: 1, role: 'admin' }, secret);

      const req = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      const res = {};
      const next = vi.fn();

      authenticate(req, res, next);

      expect(req.user).toBeDefined();
      expect(req.user.role).toBe('admin');
      expect(next).toHaveBeenCalled();
    });
  });

  describe('requireAdmin', () => {
    it('returns 403 when user is not admin', () => {
      const req = { user: { role: 'user' } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };
      const next = vi.fn();

      requireAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Bạn không có quyền thực hiện thao tác này' });
      expect(next).not.toHaveBeenCalled();
    });

    it('calls next() when user is admin', () => {
      const req = { user: { role: 'admin' } };
      const res = {};
      const next = vi.fn();

      requireAdmin(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
