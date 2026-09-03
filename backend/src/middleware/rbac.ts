import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';
import { UserRole } from '../types';

export const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    if (req.user.role === 'SUPER_ADMIN') {
      return next(); // Super Admin has global override access
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `HTTP 403 Forbidden: Role '${req.user.role}' is not authorized to access this resource.`
      });
    }

    next();
  };
};

export const authorizePersonAccess = (personIdParam: string = 'personId') => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    if (req.user.role === 'SUPER_ADMIN' || req.user.role === 'STATE_ADMIN') {
      return next();
    }

    const requestedPersonId = req.params[personIdParam] || req.body[personIdParam];
    if (req.user.role === 'CITIZEN' && req.user.personId !== requestedPersonId) {
      return res.status(403).json({
        success: false,
        message: `HTTP 403 Forbidden: Data Isolation Violation. You are logged in as Person '${req.user.personId}' and cannot access Person '${requestedPersonId}' private records.`
      });
    }

    next();
  };
};
