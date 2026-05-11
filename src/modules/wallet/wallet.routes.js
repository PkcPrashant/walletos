import { Router } from 'express';
import * as walletController from './wallet.controller.js';
import { validate, createWalletSchema, walletIdSchema } from './wallet.validator.js';
import { authenticate } from '../../shared/middleware/authenticate.js';
import { authorize } from '../../shared/middleware/authorize.js';

const router = Router();

// All wallet routes require authentication
router.use(authenticate);

// User routes
router.post('/', validate(createWalletSchema), walletController.createWallet);
router.get('/me', walletController.getMyWallet);

// Admin-only routes
router.get('/:id', authorize('admin'), validate(walletIdSchema), walletController.getWalletById);
router.patch('/:id/freeze', authorize('admin'), validate(walletIdSchema), walletController.freezeWallet);
router.patch('/:id/unfreeze', authorize('admin'), validate(walletIdSchema), walletController.unfreezeWallet);
router.patch('/:id/close', authorize('admin'), validate(walletIdSchema), walletController.closeWallet);

export default router;