import { Router } from 'express';
import {
  register,
  verifyOTP,
  login,
  resendOTP,
} from '../controllers/authController';

const router = Router();

/**
 * POST /api/auth/register
 * Register a new user and send OTP
 */
router.post('/register', register);

/**
 * POST /api/auth/verify
 * Verify OTP and get JWT token
 */
router.post('/verify', verifyOTP);

/**
 * POST /api/auth/login
 * User login
 */
router.post('/login', login);

/**
 * POST /api/auth/resend-otp
 * Resend OTP to email
 */
router.post('/resend-otp', resendOTP);

export default router;
