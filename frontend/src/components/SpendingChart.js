import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, } from 'recharts';
import { formatCurrency } from '../utils/formatters';
export const SpendingChart = ({ data, title, type = 'pie', }) => {
    if (!data || data.length === 0) {
        return (_jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-4 text-gray-900", children: title }), _jsx("div", { className: "text-center py-12 text-gray-500", children: "No data available" })] }));
    }
    return (_jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-4 text-gray-900", children: title }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: type === 'pie' ? (_jsxs(PieChart, { children: [_jsx(Pie, { data: data, dataKey: "amount", nameKey: "category", cx: "50%", cy: "50%", outerRadius: 80, fill: "#8b5cf6", label: true }), _jsx(Tooltip, { formatter: (value) => formatCurrency(value) })] })) : (_jsxs(BarChart, { data: data, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "category" }), _jsx(YAxis, {}), _jsx(Tooltip, { formatter: (value) => formatCurrency(value) }), _jsx(Legend, {}), _jsx(Bar, { dataKey: "amount", fill: "#8b5cf6", name: "Amount" })] })) })] }));
};
