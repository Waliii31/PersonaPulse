import { Router } from 'express';
import {
  register,
  login,
  demoLogin,
  getMe,
  createPersona,
  saveAudit,
} from '../controllers/authController';
import { requireAuth } from '../middleware/auth';
import { authLoginRateLimiter } from '../middleware/rateLimiter';

const router = Router();

// Public auth endpoints
router.post('/register', register);
router.post('/login', authLoginRateLimiter, login);
router.post('/demo', demoLogin);

// Protected endpoints
router.get('/me', requireAuth, getMe);
router.post('/personas', requireAuth, createPersona);
router.post('/save-audit', requireAuth, saveAudit);

export default router;
