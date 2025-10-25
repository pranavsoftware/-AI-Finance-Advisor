import { useEffect, useState, type FC } from 'react';
import { useAuthStore } from '../context/authStore';
import { FileUpload } from '../components/FileUpload';
import { TransactionTable } from '../components/TransactionTable';
import { SpendingChart } from '../components/SpendingChart';
import { AIInsights } from '../components/AIInsights';
import { PredictionChart } from '../components/PredictionChart';
import { transactionAPI, aiAPI, mlAPI } from '../services/apiCalls';
import { Transaction, AIInsight, Prediction, UploadResponse } from '../types';

export const Dashboard: FC = () => {
  const { user } = useAuthStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<Array<{ category: string; amount: number }>>([]);
  const [aiInsight, setAIInsight] = useState<AIInsight | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [predictionError, setPredictionError] = useState<string | null>(null);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const response = await transactionAPI.getTransactions();
      console.log('Transactions loaded:', response.data);
      setTransactions(response.data.transactions || []);
      
      const stats = await transactionAPI.getStats();
      console.log('Stats loaded:', stats.data);
      setCategoryBreakdown(stats.data.categoryBreakdown || []);
    } catch (err: any) {
      console.error('Error loading transactions:', err);
      setError(err.response?.data?.error || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const loadInsights = async () => {
    try {
      setInsightsLoading(true);
      const response = await aiAPI.getInsights();
      console.log('Insights loaded:', response.data);
      setAIInsight(response.data);
    } catch (err: any) {
      console.warn('Failed to load insights:', err.message);
    } finally {
      setInsightsLoading(false);
    }
  };

  const loadPredictions = async () => {
    try {
      setPredictionError(null);
      const response = await mlAPI.getPredictions();
      console.log('Predictions loaded:', response.data);
      setPredictions(response.data.predictions || []);
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message;
      console.warn('ML predictions unavailable:', errorMsg);
      // This is expected - ML requires at least 10 transactions
      if (err.response?.status === 400) {
        setPredictionError('Need at least 10 transactions for predictions');
        console.log('💡 Need more transactions for predictions (minimum 10)');
      } else {
        setPredictionError('Unable to load predictions');
      }
    }
  };

  useEffect(() => {
    console.log('Dashboard mounted, user:', user);
    if (user) {
      loadTransactions();
      loadInsights();
      loadPredictions();
    }
  }, [user]);

  const handleUploadSuccess = (response: UploadResponse) => {
    setSuccess(`✅ Uploaded ${response.uploadedCount} transactions`);
    loadTransactions();
    loadInsights();
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await transactionAPI.deleteTransaction(id);
      loadTransactions();
      setSuccess('✅ Transaction deleted');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete transaction');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Welcome, {user?.name}!
          </p>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <svg className="inline-block animate-spin h-12 w-12 text-purple-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-4 text-gray-600 font-medium">Loading your data...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-3">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-start gap-3">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{success}</span>
          </div>
        )}

        {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 flex items-center gap-2">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload Transactions
              </h2>
              <FileUpload
                onUploadSuccess={handleUploadSuccess}
                onError={(err: any) => {
                  setError(err);
                  setTimeout(() => setError(''), 3000);
                }}
              />
            </div>

            {categoryBreakdown.length > 0 && (
              <SpendingChart
                data={categoryBreakdown}
                title="Spending by Category"
                type="pie"
              />
            )}
            
            {categoryBreakdown.length === 0 && (
              <div className="bg-white rounded-xl shadow-md p-8 text-center border border-gray-200">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-gray-500">No spending data yet. Upload transactions to see charts.</p>
              </div>
            )}
          </div>

          {aiInsight && (
            <AIInsights
              insight={aiInsight}
              loading={insightsLoading}
              onRefresh={loadInsights}
            />
          )}
          
          {!aiInsight && !loading && (
            <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                <svg className="w-7 h-7 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                AI Insights
              </h3>
              <div className="bg-white bg-opacity-10 rounded-lg p-8 backdrop-blur-sm text-center border border-white border-opacity-20">
                <svg className="w-20 h-20 mx-auto mb-4 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <p className="text-purple-100 text-lg font-medium">Upload transactions to get started</p>
                <p className="text-purple-200 text-sm mt-2">AI will analyze your spending patterns and provide personalized insights.</p>
              </div>
            </div>
          )}
        </div>
        )}

        {!loading && transactions.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Recent Transactions
            </h2>
            <TransactionTable
              transactions={transactions}
              onDelete={handleDeleteTransaction}
              loading={loading}
            />
          </div>
        )}

        {!loading && transactions.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-8 text-center mb-8 border border-gray-200">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <p className="text-gray-500 font-medium">No transactions yet. Upload a CSV file to get started!</p>
          </div>
        )}

        {predictions.length > 0 && (
          <PredictionChart predictions={predictions} />
        )}

        {!loading && predictions.length === 0 && predictionError && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl shadow-md p-6 text-center text-blue-700 mb-8">
            <svg className="w-12 h-12 mx-auto mb-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-medium">{predictionError}</p>
          </div>
        )}
      </div>
    </div>
  );
};
