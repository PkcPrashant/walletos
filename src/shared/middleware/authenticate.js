import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { ApiError } from '../utils/ApiError.js';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new ApiError(401, 'No access token provided');
  }

  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, env.JWT_ACCESS_SECRET);
    next();
  } catch {
    throw new ApiError(401, 'Invalid or expired access token');
  }
};