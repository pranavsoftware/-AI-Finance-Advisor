import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useAuthStore } from '../context/authStore';
import { FileUpload } from '../components/FileUpload';
import { TransactionTable } from '../components/TransactionTable';
import { SpendingChart } from '../components/SpendingChart';
import { AIInsights } from '../components/AIInsights';
import { PredictionChart } from '../components/PredictionChart';
import { transactionAPI, aiAPI, mlAPI } from '../services/apiCalls';
export const Dashboard = () => {
    const { user } = useAuthStore();
    const [transactions, setTransactions] = useState([]);
    const [categoryBreakdown, setCategoryBreakdown] = useState([]);
    const [aiInsight, setAIInsight] = useState(null);
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [predictionError, setPredictionError] = useState(null);
    const loadTransactions = async () => {
        try {
            setLoading(true);
            const response = await transactionAPI.getTransactions();
            console.log('Transactions loaded:', response.data);
            setTransactions(response.data.transactions || []);
            const stats = await transactionAPI.getStats();
            console.log('Stats loaded:', stats.data);
            setCategoryBreakdown(stats.data.categoryBreakdown || []);
        }
        catch (err) {
            console.error('Error loading transactions:', err);
            setError(err.response?.data?.error || 'Failed to load transactions');
        }
        finally {
            setLoading(false);
        }
    };
    const loadInsights = async () => {
        try {
            const response = await aiAPI.getInsights();
            console.log('Insights loaded:', response.data);
            setAIInsight(response.data);
        }
        catch (err) {
            console.warn('Failed to load insights:', err.message);
        }
    };
    const loadPredictions = async () => {
        try {
            setPredictionError(null);
            const response = await mlAPI.getPredictions();
            console.log('Predictions loaded:', response.data);
            setPredictions(response.data.predictions || []);
        }
        catch (err) {
            const errorMsg = err.response?.data?.error || err.message;
            console.warn('ML predictions unavailable:', errorMsg);
            // This is expected - ML requires at least 10 transactions
            if (err.response?.status === 400) {
                setPredictionError('Need at least 10 transactions for predictions');
                console.log('💡 Need more transactions for predictions (minimum 10)');
            }
            else {
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
    const handleUploadSuccess = (response) => {
        setSuccess(`✅ Uploaded ${response.uploadedCount} transactions`);
        loadTransactions();
        loadInsights();
        setTimeout(() => setSuccess(''), 3000);
    };
    const handleDeleteTransaction = async (id) => {
        try {
            await transactionAPI.deleteTransaction(id);
            loadTransactions();
            setSuccess('✅ Transaction deleted');
            setTimeout(() => setSuccess(''), 3000);
        }
        catch (err) {
            setError(err.response?.data?.error || 'Failed to delete transaction');
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gray-50 py-8", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsx("h1", { className: "text-3xl font-bold mb-2 text-gray-900", children: "Dashboard" }), _jsxs("p", { className: "text-gray-600 mb-8", children: ["Welcome, ", user?.name, "!"] }), loading && (_jsx("div", { className: "flex justify-center items-center h-64", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" }), _jsx("p", { className: "mt-4 text-gray-600", children: "Loading your data..." })] }) })), error && (_jsx("div", { className: "mb-4 p-4 bg-red-100 text-red-700 rounded-lg", children: error })), success && (_jsx("div", { className: "mb-4 p-4 bg-green-100 text-green-700 rounded-lg", children: success })), !loading && (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8", children: [_jsxs("div", { className: "lg:col-span-2", children: [_jsxs("div", { className: "bg-white rounded-lg shadow p-6 mb-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4 text-gray-900", children: "\uD83D\uDCE4 Upload Transactions" }), _jsx(FileUpload, { onUploadSuccess: handleUploadSuccess, onError: (err) => {
                                                setError(err);
                                                setTimeout(() => setError(''), 3000);
                                            } })] }), categoryBreakdown.length > 0 && (_jsx(SpendingChart, { data: categoryBreakdown, title: "Spending by Category", type: "pie" })), categoryBreakdown.length === 0 && (_jsx("div", { className: "bg-white rounded-lg shadow p-6 text-center text-gray-500", children: _jsx("p", { children: "\uD83D\uDCCA No spending data yet. Upload transactions to see charts." }) }))] }), aiInsight && (_jsx(AIInsights, { insight: aiInsight, onRefresh: loadInsights }))] })), !loading && transactions.length > 0 && (_jsxs("div", { className: "bg-white rounded-lg shadow p-6 mb-8", children: [_jsx("h2", { className: "text-xl font-semibold mb-4 text-gray-900", children: "\uD83D\uDCB3 Recent Transactions" }), _jsx(TransactionTable, { transactions: transactions, onDelete: handleDeleteTransaction, loading: loading })] })), !loading && transactions.length === 0 && (_jsx("div", { className: "bg-white rounded-lg shadow p-6 text-center text-gray-500 mb-8", children: _jsx("p", { children: "\uD83D\uDCB3 No transactions yet. Upload a CSV file to get started!" }) })), predictions.length > 0 && (_jsx(PredictionChart, { predictions: predictions })), !loading && predictions.length === 0 && predictionError && (_jsx("div", { className: "bg-blue-50 border border-blue-200 rounded-lg shadow p-6 text-center text-blue-700 mb-8", children: _jsxs("p", { children: ["\uD83D\uDCCA ", predictionError] }) }))] }) }));
};
