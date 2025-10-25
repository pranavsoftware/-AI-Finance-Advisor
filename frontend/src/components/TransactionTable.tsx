import { type FC } from 'react';
import { formatCurrency } from '../utils/formatters';
import { Transaction } from '../types';

interface TransactionTableProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  loading?: boolean;
}

export const TransactionTable: FC<TransactionTableProps> = ({
  transactions,
  onDelete,
  loading = false,
}) => {
  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No transactions yet. Upload a file to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Date
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Description
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Category
            </th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
              Amount
            </th>
            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr
              key={transaction._id}
              className="border-b border-gray-100 hover:bg-gray-50"
            >
              <td className="px-6 py-4 text-sm text-gray-900">
                {new Date(transaction.date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {transaction.description}
              </td>
              <td className="px-6 py-4 text-sm">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {transaction.category}
                </span>
              </td>
              <td className="px-6 py-4 text-sm font-medium text-right text-gray-900">
                {formatCurrency(transaction.amount)}
              </td>
              <td className="px-6 py-4 text-center">
                <button
                  onClick={() => onDelete(transaction._id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
