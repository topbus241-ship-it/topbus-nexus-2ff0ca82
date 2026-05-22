import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export interface AuthPayload {
  sub: string;
  role: string;
  sectorId?: string | null;
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthPayload;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.header('authorization') || req.header('Authorization');
  if (!header) return res.status(401).json({ error: 'Missing authorization' });
  const parts = header.split(' ');
  if (parts.length !== 2) return res.status(401).json({ error: 'Invalid authorization' });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as AuthPayload;
    req.auth = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
