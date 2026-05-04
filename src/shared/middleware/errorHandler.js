import { ApiError } from '../utils/ApiError.js';
import { logger } from '../../config/logger.js';
import { env } from '../../config/env.js';

export const errorHandler = (err, req, res, next) => {
  // Log every error with context
  logger.error({
    message: err.message,
    stack: env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  // Known operational error (thrown intentionally)
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: Object.values(err.errors).map(e => e.message),
    });
  }

  // Unknown/unexpected error
  return res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};