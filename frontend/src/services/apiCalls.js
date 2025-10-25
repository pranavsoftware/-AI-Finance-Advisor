import api from './api';
/**
 * Auth API calls
 */
export const authAPI = {
    register: (email, password, name) => api.post('/auth/register', {
        email,
        password,
        name,
    }),
    verifyOTP: (userId, otp) => api.post('/auth/verify', { userId, otp }),
    login: (email, password) => api.post('/auth/login', { email, password }),
    resendOTP: (email) => api.post('/auth/resend-otp', { email }),
};
/**
 * Transaction API calls
 */
export const transactionAPI = {
    upload: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/transactions/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    getTransactions: (category, startDate, endDate, limit = 50, skip = 0) => api.get('/transactions', {
        params: { category, startDate, endDate, limit, skip },
    }),
    deleteTransaction: (id) => api.delete(`/transactions/${id}`),
    getStats: () => api.get('/transactions/stats'),
};
/**
 * AI API calls
 */
export const aiAPI = {
    getInsights: () => api.post('/ai/insights'),
};
/**
 * ML API calls
 */
export const mlAPI = {
    getPredictions: () => api.get('/ml/predict'),
};
