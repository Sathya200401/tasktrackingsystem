import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { ApiError } from '../../utils/ApiError';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: 'admin' | 'viewer';
    name: string;
    email: string;
  };
}

export const authenticate = (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    throw new ApiError(401, 'Authentication required');
  }

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, env.jwtSecret) as AuthenticatedRequest['user'];
    req.user = decoded;
    next();
  } catch {
    throw new ApiError(401, 'Invalid or expired token');
  }
};

export const requireAdmin = (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    throw new ApiError(403, 'Admin privileges required');
  }
  next();
};

