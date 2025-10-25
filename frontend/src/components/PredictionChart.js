import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../utils/formatters';
export const PredictionChart = ({ predictions, loading = false, }) => {
    if (loading) {
        return (_jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-4 text-gray-900", children: "\uD83D\uDCC8 Spending Predictions" }), _jsx("div", { className: "text-center py-12 text-gray-500", children: "Loading predictions..." })] }));
    }
    if (!predictions || predictions.length === 0) {
        return (_jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-4 text-gray-900", children: "\uD83D\uDCC8 Spending Predictions" }), _jsx("div", { className: "text-center py-12 text-gray-500", children: "No predictions available. Need more transaction data." })] }));
    }
    const chartData = predictions.map((p) => ({
        date: new Date(p.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        }),
        amount: Math.round(p.predicted_amount * 100) / 100,
    }));
    return (_jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-4 text-gray-900", children: "\uD83D\uDCC8 Spending Predictions (Next 30 Days)" }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(LineChart, { data: chartData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "date" }), _jsx(YAxis, {}), _jsx(Tooltip, { formatter: (value) => formatCurrency(value) }), _jsx(Line, { type: "monotone", dataKey: "amount", stroke: "#8b5cf6", strokeWidth: 2, name: "Predicted Daily Spend" })] }) })] }));
};
