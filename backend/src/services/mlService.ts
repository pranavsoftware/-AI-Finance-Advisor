import axios from 'axios';
import logger from '../utils/logger';
import { MLPredictionResponse } from '../types';

const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:5000';

/**
 * Call ML microservice to get spending predictions
 */
export const getPredictions = async (
  transactions: any[]
): Promise<MLPredictionResponse | null> => {
  try {
    const response = await axios.post(`${mlServiceUrl}/predict`, {
      transactions: transactions.map((t) => ({
        date: t.date.toISOString().split('T')[0],
        amount: t.amount,
      })),
    });

    logger.info('✅ Predictions received from ML service');
    return response.data;
  } catch (error) {
    logger.warn('ML service unavailable or error:', error instanceof Error ? error.message : error);
    return null;
  }
};
