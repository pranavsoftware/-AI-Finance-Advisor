/**
 * Validate email format
 */
export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};
/**
 * Validate password strength
 */
export const validatePassword = (password) => {
    if (password.length < 8) {
        return 'Password must be at least 8 characters';
    }
    if (!/[A-Z]/.test(password)) {
        return 'Password must contain an uppercase letter';
    }
    if (!/[0-9]/.test(password)) {
        return 'Password must contain a number';
    }
    return null;
};
/**
 * Validate OTP format
 */
export const validateOTP = (otp) => {
    return /^\d{6}$/.test(otp);
};
