import { type FC } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Prediction } from '../types';
import { formatCurrency } from '../utils/formatters';

interface PredictionChartProps {
  predictions: Prediction[];
  loading?: boolean;
}

export const PredictionChart: FC<PredictionChartProps> = ({
  predictions,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">
          📈 Spending Predictions
        </h3>
        <div className="text-center py-12 text-gray-500">Loading predictions...</div>
      </div>
    );
  }

  if (!predictions || predictions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">
          📈 Spending Predictions
        </h3>
        <div className="text-center py-12 text-gray-500">
          No predictions available. Need more transaction data.
        </div>
      </div>
    );
  }

  const chartData = predictions.map((p) => ({
    date: new Date(p.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    amount: Math.round(p.predicted_amount * 100) / 100,
  }));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">
        📈 Spending Predictions (Next 30 Days)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip formatter={(value) => formatCurrency(value as number)} />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#8b5cf6"
            strokeWidth={2}
            name="Predicted Daily Spend"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
