import { type FC } from 'react';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '../utils/formatters';

interface SpendingChartProps {
  data: Array<{ category: string; amount: number }>;
  title: string;
  type?: 'pie' | 'bar';
}

export const SpendingChart: FC<SpendingChartProps> = ({
  data,
  title,
  type = 'pie',
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>
        <div className="text-center py-12 text-gray-500">No data available</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        {type === 'pie' ? (
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8b5cf6"
              label
            />
            <Tooltip formatter={(value) => formatCurrency(value as number)} />
          </PieChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip formatter={(value) => formatCurrency(value as number)} />
            <Legend />
            <Bar dataKey="amount" fill="#8b5cf6" name="Amount" />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};
