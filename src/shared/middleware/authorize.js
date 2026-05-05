import { ApiError } from '../utils/ApiError.js';

// Usage: authorize('admin') or authorize('admin', 'manager')
export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    throw new ApiError(403, 'Insufficient permissions');
  }
  next();
};