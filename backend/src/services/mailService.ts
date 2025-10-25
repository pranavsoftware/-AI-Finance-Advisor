import nodemailer from 'nodemailer';
import logger from '../utils/logger';

// Check if email credentials are properly configured
const hasEmailConfig = !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);

let transporter: any = null;

if (hasEmailConfig) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // This should be Gmail App Password, not regular password
    },
  });

  // Verify transporter connection
  transporter.verify((error: any, success: any) => {
    if (error) {
      logger.warn('⚠️  Email transporter verification failed (will retry on first send):', error.message);
    } else {
      logger.info('✅ Email transporter ready and verified');
    }
  });
} else {
  logger.warn('⚠️  Email credentials not configured. Using development mode (logs OTP instead of sending).');
}

/**
 * Send OTP to user's email
 */
export const sendOTPEmail = async (email: string, otp: string): Promise<void> => {
  try {
    if (!hasEmailConfig || !transporter) {
      // Development mode: log OTP instead of sending
      logger.info(`📧 [DEV MODE] OTP for ${email}: ${otp} (Valid for 5 minutes)`);
      return;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your AI Finance Advisor - OTP Verification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; color: white; border-radius: 10px 10px 0 0;">
            <h2 style="margin: 0;">Welcome to AI Finance Advisor</h2>
          </div>
          <div style="padding: 20px; background: #f9fafb;">
            <p style="color: #374151;">Your One-Time Password (OTP) is:</p>
            <div style="background: #ffffff; border: 2px solid #667eea; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0;">
              <h1 style="margin: 0; color: #667eea; letter-spacing: 5px; font-size: 48px;">${otp}</h1>
            </div>
            <p style="color: #6b7280; font-size: 14px;">
              ⏱️ This OTP is valid for 5 minutes only.
            </p>
            <p style="color: #6b7280; font-size: 14px;">
              🔒 Do not share this code with anyone.
            </p>
            <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
              If you didn't request this code, please ignore this email.
            </p>
          </div>
          <div style="background: #f3f4f6; padding: 20px; text-align: center; color: #9ca3af; font-size: 12px; border-radius: 0 0 10px 10px;">
            <p>© 2024 AI Finance Advisor. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      logger.info(`✅ OTP email sent successfully to ${email} (Message ID: ${info.messageId})`);
    } catch (smtpError: any) {
      logger.error(`❌ SMTP Error sending OTP to ${email}:`, {
        code: smtpError.code,
        message: smtpError.message,
        command: smtpError.command,
      });
      throw smtpError;
    }
  } catch (error) {
    logger.error(`❌ Failed to send OTP email to ${email}:`, error);
    throw new Error('Failed to send OTP email');
  }
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string
): Promise<void> => {
  try {
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reset Your AI Finance Advisor Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; color: white; border-radius: 10px 10px 0 0;">
            <h2 style="margin: 0;">Password Reset Request</h2>
          </div>
          <div style="padding: 20px; background: #f9fafb;">
            <p style="color: #374151;">Click the link below to reset your password:</p>
            <div style="margin: 20px 0;">
              <a href="${resetLink}" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
            </div>
            <p style="color: #6b7280; font-size: 14px;">
              This link is valid for 1 hour.
            </p>
            <p style="color: #6b7280; font-size: 14px;">
              If you didn't request a password reset, please ignore this email.
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`✅ Password reset email sent to ${email}`);
  } catch (error) {
    logger.error(`❌ Failed to send password reset email to ${email}:`, error);
    throw new Error('Failed to send password reset email');
  }
};
