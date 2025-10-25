export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Transaction {
  _id: string;
  userId: string;
  date: string;
  amount: number;
  description: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}

export interface UploadResponse {
  uploadedCount: number;
  categorized: number;
  errors: Array<{ row: number; error: string }>;
}

export interface AIInsight {
  insights: string;
  summary: {
    totalSpend: number;
    monthlyAverage: number;
    topCategories: Array<{ category: string; amount: number }>;
  };
  generatedAt: string;
}

export interface Prediction {
  date: string;
  predicted_amount: number;
}
