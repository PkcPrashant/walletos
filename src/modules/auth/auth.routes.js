import { Router } from 'express';
import * as authController from './auth.controller.js';
import { validate, registerSchema, loginSchema } from './auth.validator.js';
import { authenticate } from '../../shared/middleware/authenticate.js';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getMe);

export default router;