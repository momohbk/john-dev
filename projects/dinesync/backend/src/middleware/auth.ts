import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dinesync-dev-secret-change-in-production';

export interface AuthRequest extends Request {
  userId?: number;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header) {
    res.status(401).json({ error: 'Authorization header required' });
    return;
  }

  const parts = header.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    res.status(401).json({ error: 'Invalid authorization format' });
    return;
  }

  try {
    const decoded = jwt.verify(parts[1], JWT_SECRET) as { sub: number } | string;
    if (typeof decoded === 'string') throw new Error('Invalid token');
    req.userId = decoded.sub;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function generateToken(userId: number): string {
  return jwt.sign(
    { iss: 'dinesync', sub: userId },
    JWT_SECRET,
    { expiresIn: '24h' },
  );
}
