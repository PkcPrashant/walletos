import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';

import { requestLogger } from './shared/middleware/requestLogger.js';
import { errorHandler } from './shared/middleware/errorHandler.js';
import { env } from './config/env.js';
import authRoutes from './modules/auth/auth.routes.js';
import walletRoutes from './modules/wallet/wallet.routes.js';

export const createApp = () => {
  const app = express();

  // Security & parsing
  app.use(helmet());
  app.use(cors({ origin: env.NODE_ENV === 'development' ? '*' : false, credentials: true }));
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));
  app.use(cookieParser());

  // Logging
  app.use(requestLogger);

  // Health checks
  app.get('/health', (req, res) => res.json({ status: 'ok' }));
  app.get('/api/v1/ready', (req, res) => {
    const isDBReady = mongoose.connection.readyState === 1;
    if (!isDBReady) return res.status(503).json({ status: 'unavailable' });
    res.json({ status: 'ready' });
  });

  // Routes go here (added per phase)

  // inside createApp(), after middleware, before errorHandler:
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/wallets', walletRoutes);

  // Must be last
  app.use(errorHandler);

  return app;
};