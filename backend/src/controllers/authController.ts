import { Request, Response } from 'express';
import User from '../models/User';
import OTPToken from '../models/OTPToken';
import {
  hashPassword,
  comparePassword,
  generateJWT,
  generateOTPCode,
  hashOTP,
  compareOTP,
} from '../services/authService';
import { sendOTPEmail } from '../services/mailService';
import { registerSchema, loginSchema, verifyOTPSchema } from '../utils/validators';
import logger from '../utils/logger';

/**
 * Register a new user and send OTP
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ error: validation.error.errors[0].message });
      return;
    }

    const { email, password, name } = validation.data;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }

    // Create new user
    const hashedPassword = await hashPassword(password);
    const user = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      verified: false,
    });
    await user.save();

    // Generate and send OTP
    const otpCode = generateOTPCode();
    const hashedOTP = await hashOTP(otpCode);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await OTPToken.create({
      email: email.toLowerCase(),
      code: hashedOTP,
      expiresAt,
      attempts: 0,
    });

    try {
      await sendOTPEmail(email, otpCode);
    } catch (emailError) {
      logger.warn(`⚠️ OTP email failed for ${email}, but user created. User can request resend.`, emailError);
      // Don't fail registration if email fails - user can retry
    }

    logger.info(`✅ User registered: ${email}`);
    res.status(201).json({
      message: 'User registered. OTP sent to email.',
      userId: user._id,
    });
  } catch (error) {
    logger.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

/**
 * Verify OTP and get JWT token
 */
export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = verifyOTPSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ error: validation.error.errors[0].message });
      return;
    }

    const { userId, otp } = validation.data;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Find and validate OTP
    const otpToken = await OTPToken.findOne({ email: user.email });
    if (!otpToken) {
      res.status(400).json({ error: 'OTP not found or expired' });
      return;
    }

    if (new Date() > otpToken.expiresAt) {
      await OTPToken.deleteOne({ _id: otpToken._id });
      res.status(400).json({ error: 'OTP has expired' });
      return;
    }

    if (otpToken.attempts >= 3) {
      await OTPToken.deleteOne({ _id: otpToken._id });
      res.status(400).json({ error: 'Too many attempts. Please request a new OTP.' });
      return;
    }

    const isValidOTP = await compareOTP(otp, otpToken.code);
    if (!isValidOTP) {
      otpToken.attempts += 1;
      await otpToken.save();
      res.status(400).json({ error: 'Invalid OTP' });
      return;
    }

    // Mark user as verified
    user.verified = true;
    await user.save();

    // Delete OTP token
    await OTPToken.deleteOne({ _id: otpToken._id });

    // Generate JWT
    const token = generateJWT({
      userId: user._id?.toString() || '',
      email: user.email,
    });

    logger.info(`✅ User verified: ${user.email}`);
    res.status(200).json({
      message: 'Email verified successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    logger.error('Verify OTP error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
};

/**
 * User login
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ error: validation.error.errors[0].message });
      return;
    }

    const { email, password } = validation.data;

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Check email verified
    if (!user.verified) {
      res.status(403).json({ error: 'Email not verified. Please check your email for OTP.' });
      return;
    }

    // Compare password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Generate JWT
    const token = generateJWT({
      userId: user._id?.toString() || '',
      email: user.email,
    });

    logger.info(`✅ User logged in: ${user.email}`);
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

/**
 * Resend OTP
 */
export const resendOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: 'Email is required' });
      return;
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (user.verified) {
      res.status(400).json({ error: 'User already verified' });
      return;
    }

    // Delete old OTP
    await OTPToken.deleteOne({ email: email.toLowerCase() });

    // Generate and send new OTP
    const otpCode = generateOTPCode();
    const hashedOTP = await hashOTP(otpCode);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await OTPToken.create({
      email: email.toLowerCase(),
      code: hashedOTP,
      expiresAt,
      attempts: 0,
    });

    await sendOTPEmail(email, otpCode);

    logger.info(`✅ OTP resent to: ${email}`);
    res.status(200).json({ message: 'OTP sent to email' });
  } catch (error) {
    logger.error('Resend OTP error:', error);
    res.status(500).json({ error: 'Failed to resend OTP' });
  }
};
