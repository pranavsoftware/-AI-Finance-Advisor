import { z } from 'zod';

/**
 * Validation schemas for API inputs
 */

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const verifyOTPSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  otp: z.string().regex(/^\d{6}$/, 'OTP must be 6 digits'),
});

export const transactionSchema = z.object({
  date: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  amount: z.number().positive('Amount must be positive'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().optional(),
});

/**
 * Validate and sanitize email
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

/**
 * Sanitize input string
 */
export const sanitizeString = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};
