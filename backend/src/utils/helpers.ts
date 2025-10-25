/**
 * Helper utility functions
 */

/**
 * Generate a random 6-digit OTP
 */
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Format date to YYYY-MM-DD
 */
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Parse date string in YYYY-MM-DD format
 */
export const parseDate = (dateStr: string): Date | null => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return null;
  
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
};

/**
 * Round number to 2 decimal places
 */
export const roundToTwoDecimals = (num: number): number => {
  return Math.round(num * 100) / 100;
};

/**
 * Calculate spending summary from transactions
 */
export const calculateSpendingSummary = (transactions: any[]) => {
  const totalSpend = roundToTwoDecimals(
    transactions.reduce((sum, t) => sum + t.amount, 0)
  );

  const categoryMap: { [key: string]: number } = {};
  transactions.forEach((t) => {
    const cat = t.category || 'Uncategorized';
    categoryMap[cat] = (categoryMap[cat] || 0) + t.amount;
  });

  const topCategories = Object.entries(categoryMap)
    .map(([category, amount]) => ({
      category,
      amount: roundToTwoDecimals(amount as number),
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  const dates = transactions.map((t) => new Date(t.date));
  const startDate = new Date(Math.min(...dates.map((d) => d.getTime())));
  const endDate = new Date(Math.max(...dates.map((d) => d.getTime())));

  const monthsDiff =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());
  const monthlyAverage = roundToTwoDecimals(
    totalSpend / Math.max(monthsDiff, 1)
  );

  return {
    totalSpend,
    monthlyAverage,
    topCategories,
    transactionCount: transactions.length,
    dateRange: { start: startDate, end: endDate },
  };
};

/**
 * Retry function with exponential backoff
 */
export const retry = async <T>(
  fn: () => Promise<T>,
  attempts = 3,
  delay = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (attempts <= 1) throw error;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retry(fn, attempts - 1, delay * 2);
  };
};
