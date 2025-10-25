import api from './api';
import { AuthResponse, UploadResponse, AIInsight, Prediction } from '../types';

/**
 * Auth API calls
 */
export const authAPI = {
  register: (email: string, password: string, name: string) =>
    api.post<{ userId: string; message: string }>('/auth/register', {
      email,
      password,
      name,
    }),

  verifyOTP: (userId: string, otp: string) =>
    api.post<AuthResponse>('/auth/verify', { userId, otp }),

  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }),

  resendOTP: (email: string) =>
    api.post<{ message: string }>('/auth/resend-otp', { email }),
};

/**
 * Transaction API calls
 */
export const transactionAPI = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<UploadResponse>('/transactions/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  getTransactions: (
    category?: string,
    startDate?: string,
    endDate?: string,
    limit = 50,
    skip = 0
  ) =>
    api.get<{ transactions: any[]; total: number }>('/transactions', {
      params: { category, startDate, endDate, limit, skip },
    }),

  deleteTransaction: (id: string) =>
    api.delete(`/transactions/${id}`),

  getStats: () =>
    api.get<any>('/transactions/stats'),
};

/**
 * AI API calls
 */
export const aiAPI = {
  getInsights: () =>
    api.post<AIInsight>('/ai/insights'),
};

/**
 * ML API calls
 */
export const mlAPI = {
  getPredictions: () =>
    api.get<{ predictions: Prediction[]; generatedAt: string }>('/ml/predict'),
};
