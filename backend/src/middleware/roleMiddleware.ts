import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware.js';

export const requireRole = (allowedRoles: ('founder' | 'admin')[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Forbidden. You do not possess the required privilege level to access this resource.',
      });
      return;
    }

    next();
  };
};

export const founderOnly = requireRole(['founder']);
export const adminOrFounder = requireRole(['founder', 'admin']);
