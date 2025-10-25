import { Request, Response } from 'express';
import Transaction from '../models/Transaction';
import { parseFile } from '../services/csvParser';
import { categorizeTransactions } from '../services/geminiService';
import logger from '../utils/logger';
import { transactionSchema } from '../utils/validators';

/**
 * Upload and parse transactions from CSV/Excel
 */
export const uploadTransactions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const { transactions, errors } = parseFile(req.file.buffer, req.file.originalname);

    if (transactions.length === 0) {
      res.status(400).json({
        error: 'No valid transactions found',
        errors,
      });
      return;
    }

    // Extract descriptions for categorization
    const descriptions = transactions.map((t) => t.description);

    // Categorize using Gemini
    let categorized: Array<{ description: string; category: string }> = [];
    try {
      categorized = await categorizeTransactions(descriptions);
    } catch (error) {
      logger.warn('Categorization failed, proceeding without AI categorization');
    }

    // Create category map
    const categoryMap = new Map(
      categorized.map((c) => [c.description, c.category])
    );

    // Save transactions to database
    const transactionDocs = transactions.map((t, index) => ({
      userId: req.user!.userId,
      date: t.date,
      amount: t.amount,
      description: t.description,
      category: categoryMap.get(t.description) || 'Uncategorized',
    }));

    const savedTransactions = await Transaction.insertMany(transactionDocs);

    logger.info(
      `✅ Uploaded ${savedTransactions.length} transactions for user ${req.user.userId}`
    );

    res.status(201).json({
      message: 'Transactions uploaded successfully',
      uploadedCount: savedTransactions.length,
      categorized: categorized.length,
      errors,
    });
  } catch (error) {
    logger.error('Upload transactions error:', error);
    res.status(500).json({ error: 'Failed to upload transactions' });
  }
};

/**
 * Get user's transactions
 */
export const getTransactions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { category, startDate, endDate, limit = 50, skip = 0 } = req.query;

    const filter: any = { userId: req.user.userId };

    if (category) {
      filter.category = category;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate as string);
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate as string);
      }
    }

    const transactions = await Transaction.find(filter)
      .sort({ date: -1 })
      .limit(parseInt(limit as string))
      .skip(parseInt(skip as string));

    const total = await Transaction.countDocuments(filter);

    res.status(200).json({
      transactions,
      total,
      limit: parseInt(limit as string),
      skip: parseInt(skip as string),
    });
  } catch (error) {
    logger.error('Get transactions error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

/**
 * Delete a transaction
 */
export const deleteTransaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;

    const transaction = await Transaction.findOneAndDelete({
      _id: id,
      userId: req.user.userId,
    });

    if (!transaction) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }

    logger.info(`✅ Deleted transaction ${id}`);
    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    logger.error('Delete transaction error:', error);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
};

/**
 * Get transaction statistics
 */
export const getTransactionStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const transactions = await Transaction.find({ userId: req.user.userId });

    if (transactions.length === 0) {
      res.status(200).json({
        totalSpend: 0,
        averageTransaction: 0,
        transactionCount: 0,
        categoryBreakdown: [],
      });
      return;
    }

    const totalSpend = transactions.reduce((sum, t) => sum + t.amount, 0);
    const averageTransaction = totalSpend / transactions.length;

    const categoryBreakdown: { [key: string]: number } = {};
    transactions.forEach((t) => {
      const cat = t.category || 'Uncategorized';
      categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + t.amount;
    });

    res.status(200).json({
      totalSpend: Math.round(totalSpend * 100) / 100,
      averageTransaction: Math.round(averageTransaction * 100) / 100,
      transactionCount: transactions.length,
      categoryBreakdown: Object.entries(categoryBreakdown).map(
        ([category, amount]) => ({
          category,
          amount: Math.round(amount * 100) / 100,
        })
      ),
    });
  } catch (error) {
    logger.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};
