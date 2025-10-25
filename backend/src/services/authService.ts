import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import logger from '../utils/logger';
import { JWTPayload } from '../types';
import { generateOTP } from '../utils/helpers';

/**
 * Hash password using bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    logger.error('Error hashing password:', error);
    throw new Error('Failed to hash password');
  }
};

/**
 * Compare password with hash
 */
export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    logger.error('Error comparing password:', error);
    throw new Error('Failed to compare password');
  }
};

/**
 * Generate JWT token
 */
export const generateJWT = (payload: JWTPayload): string => {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET not configured');
    }

    const expiresIn = process.env.JWT_EXPIRY || '7d';
    const token = jwt.sign(payload, secret, {
      expiresIn,
    } as any);

    logger.info(`✅ JWT token generated for user ${payload.email}`);
    return token;
  } catch (error) {
    logger.error('Error generating JWT:', error);
    throw new Error('Failed to generate JWT token');
  }
};

/**
 * Verify JWT token
 */
export const verifyJWT = (token: string): JWTPayload => {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET not configured');
    }

    const decoded = jwt.verify(token, secret) as JWTPayload;
    return decoded;
  } catch (error) {
    logger.error('Error verifying JWT:', error);
    throw new Error('Invalid or expired token');
  }
};

/**
 * Generate OTP code
 */
export const generateOTPCode = (): string => {
  return generateOTP();
};

/**
 * Hash OTP code
 */
export const hashOTP = async (otp: string): Promise<string> => {
  try {
    return await bcrypt.hash(otp, 5);
  } catch (error) {
    logger.error('Error hashing OTP:', error);
    throw new Error('Failed to hash OTP');
  }
};

/**
 * Compare OTP with hash
 */
export const compareOTP = async (
  otp: string,
  hash: string
): Promise<boolean> => {
  try {
    return await bcrypt.compare(otp, hash);
  } catch (error) {
    logger.error('Error comparing OTP:', error);
    throw new Error('Failed to compare OTP');
  }
};
