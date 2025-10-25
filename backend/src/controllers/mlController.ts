import { Request, Response } from 'express';
import Transaction from '../models/Transaction';
import { getPredictions } from '../services/mlService';
import logger from '../utils/logger';

/**
 * Get spending predictions from ML service
 */
export const getPredictedSpending = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Fetch user transactions
    const transactions = await Transaction.find({
      userId: req.user.userId,
    });

    if (transactions.length < 10) {
      res.status(200).json({
        predictions: [],
        message: 'Need at least 10 transactions for predictions',
        generatedAt: new Date(),
      });
      return;
    }

    // Get predictions from ML service
    const predictions = await getPredictions(transactions);

    if (!predictions) {
      // Return empty predictions instead of error
      logger.warn('ML service unavailable, returning empty predictions');
      res.status(200).json({
        predictions: [],
        message: 'ML service temporarily unavailable',
        generatedAt: new Date(),
      });
      return;
    }

    logger.info(`✅ Generated predictions for user ${req.user.userId}`);

    res.status(200).json({
      predictions: predictions.predictions,
      generatedAt: new Date(),
    });
  } catch (error) {
    logger.error('Get predictions error:', error);
    res.status(200).json({
      predictions: [],
      message: 'Unable to generate predictions',
      generatedAt: new Date(),
    });
  }
};
