import { z } from 'zod';
import { validate } from '../auth/auth.validator.js'; // reuse the factory

const SUPPORTED_CURRENCIES = ['AED', 'USD', 'EUR', 'GBP', 'INR'];

export const createWalletSchema = z.object({
  body: z.object({
    currency: z.enum(SUPPORTED_CURRENCIES).default('AED'),
  }),
});

export const walletIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid wallet ID'),
  }),
});

export { validate };