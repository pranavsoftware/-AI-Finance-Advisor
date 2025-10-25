import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';
import { authAPI } from '../services/apiCalls';
import { validateEmail, validatePassword, validateOTP } from '../utils/validators';
export const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [isVerifying, setIsVerifying] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [otp, setOtp] = useState('');
    const [userId, setUserId] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { setAuth } = useAuthStore();
    const navigate = useNavigate();
    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        if (!validateEmail(email)) {
            setError('Invalid email format');
            return;
        }
        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            return;
        }
        if (name.length < 2) {
            setError('Name must be at least 2 characters');
            return;
        }
        try {
            setLoading(true);
            const response = await authAPI.register(email, password, name);
            setUserId(response.data.userId);
            setIsVerifying(true);
            setPassword('');
        }
        catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
        finally {
            setLoading(false);
        }
    };
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');
        if (!validateOTP(otp)) {
            setError('OTP must be 6 digits');
            return;
        }
        try {
            setLoading(true);
            const response = await authAPI.verifyOTP(userId, otp);
            setAuth(response.data.user, response.data.token);
            navigate('/dashboard');
        }
        catch (err) {
            setError(err.response?.data?.error || 'OTP verification failed');
        }
        finally {
            setLoading(false);
        }
    };
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        if (!validateEmail(email)) {
            setError('Invalid email format');
            return;
        }
        try {
            setLoading(true);
            const response = await authAPI.login(email, password);
            setAuth(response.data.user, response.data.token);
            navigate('/dashboard');
        }
        catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
        finally {
            setLoading(false);
        }
    };
    if (isVerifying) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-700", children: _jsxs("div", { className: "bg-white rounded-lg shadow-xl p-8 w-full max-w-md", children: [_jsx("h2", { className: "text-2xl font-bold mb-6 text-gray-900 text-center", children: "Verify Email" }), error && (_jsx("div", { className: "mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm", children: error })), _jsxs("form", { onSubmit: handleVerifyOTP, children: [_jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Enter OTP (6 digits)" }), _jsx("input", { type: "text", maxLength: 6, value: otp, onChange: (e) => setOtp(e.target.value.replace(/\D/g, '')), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600", placeholder: "000000" }), _jsxs("p", { className: "mt-2 text-sm text-gray-600", children: ["OTP sent to ", email] })] }), _jsx("button", { type: "submit", disabled: loading, className: "w-full py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors font-medium", children: loading ? 'Verifying...' : 'Verify OTP' }), _jsx("button", { type: "button", onClick: () => {
                                    setIsVerifying(false);
                                    setOtp('');
                                    setEmail('');
                                }, className: "w-full mt-2 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium", children: "Back" })] })] }) }));
    }
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-700", children: _jsxs("div", { className: "bg-white rounded-lg shadow-xl p-8 w-full max-w-md", children: [_jsx("h2", { className: "text-2xl font-bold mb-6 text-gray-900 text-center", children: isLogin ? '🔐 Login' : '📝 Register' }), error && (_jsx("div", { className: "mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm", children: error })), _jsxs("form", { onSubmit: isLogin ? handleLogin : handleRegister, children: [!isLogin && (_jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Full Name" }), _jsx("input", { type: "text", value: name, onChange: (e) => setName(e.target.value), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600", placeholder: "John Doe" })] })), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Email" }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600", placeholder: "you@example.com" })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Password" }), _jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" }), !isLogin && (_jsx("p", { className: "mt-1 text-xs text-gray-600", children: "Min 8 chars, with uppercase and number" }))] }), _jsx("button", { type: "submit", disabled: loading, className: "w-full py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors font-medium", children: loading ? 'Please wait...' : isLogin ? 'Login' : 'Register' })] }), _jsx("div", { className: "mt-4 text-center", children: _jsx("button", { onClick: () => {
                            setIsLogin(!isLogin);
                            setError('');
                            setEmail('');
                            setPassword('');
                            setName('');
                        }, className: "text-sm text-primary-600 hover:text-primary-700 font-medium", children: isLogin ? "Don't have an account? Register" : 'Already have an account? Login' }) })] }) }));
};
