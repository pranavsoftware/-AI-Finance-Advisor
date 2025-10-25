/**
 * TypeScript Interfaces and Types for the application
 */

export interface IUser {
  email: string;
  password: string;
  name: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITransaction {
  userId: string | any;
  date: Date;
  amount: number;
  description: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategory {
  name: string;
  color?: string;
}

export interface IOTPToken {
  email: string;
  code: string;
  expiresAt: Date;
  attempts: number;
  createdAt: Date;
}

export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface SpendingSummary {
  totalSpend: number;
  monthlyAverage: number;
  topCategories: Array<{ category: string; amount: number }>;
  transactionCount: number;
  dateRange: { start: Date; end: Date };
}

export interface TransactionUploadResponse {
  uploadedCount: number;
  categorized: number;
  errors: Array<{ row: number; error: string }>;
}

export interface AIInsightResponse {
  insights: string;
  generatedAt: Date;
}

export interface MLPredictionResponse {
  predictions: Array<{
    date: string;
    predicted_amount: number;
  }>;
}
