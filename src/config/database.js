import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from './logger.js';

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

export const connectDB = async (retries = MAX_RETRIES) => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    logger.info('MongoDB connected');
  } catch (err) {
    if (retries === 0) {
      logger.error('MongoDB connection failed after max retries');
      process.exit(1);
    }
    logger.warn(`MongoDB connection failed. Retrying in ${RETRY_DELAY_MS}ms... (${retries} retries left)`);
    await new Promise(res => setTimeout(res, RETRY_DELAY_MS));
    return connectDB(retries - 1);
  }
};