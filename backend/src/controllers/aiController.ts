import { Request, Response } from 'express';
import Transaction from '../models/Transaction';
import Insight from '../models/Insight';
import { getSpendingInsights } from '../services/geminiService';
import { calculateSpendingSummary } from '../utils/helpers';
import logger from '../utils/logger';

/**
 * Get AI-powered spending insights
 */
export const getInsights = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Check if we should use cached insight (generated in last 24 hours)
    const cachedInsight = await Insight.findOne({
      userId: req.user.userId,
    }).sort({ createdAt: -1 });

    if (cachedInsight) {
      const hoursSinceGenerated = 
        (Date.now() - cachedInsight.createdAt.getTime()) / (1000 * 60 * 60);
      
      // Return cached insight if less than 24 hours old
      if (hoursSinceGenerated < 24) {
        logger.info(`📦 Returning cached insights for user ${req.user.userId}`);
        res.status(200).json({
          insights: cachedInsight.insights,
          summary: cachedInsight.summary,
          generatedAt: cachedInsight.generatedAt,
          cached: true,
        });
        return;
      }
    }

    // Fetch user transactions
    const transactions = await Transaction.find({
      userId: req.user.userId,
    }).sort({ date: -1 });

    if (transactions.length === 0) {
      res.status(200).json({
        insights:
          'No transactions found. Upload your spending data to get insights.',
        generatedAt: new Date(),
      });
      return;
    }

    // Calculate spending summary
    const summary = calculateSpendingSummary(transactions);

    // Get AI insights from Gemini
    const insights = await getSpendingInsights(
      transactions.slice(0, 20),
      summary
    );

    // Save insight to database
    const savedInsight = await Insight.create({
      userId: req.user.userId,
      insights,
      summary,
      generatedAt: new Date(),
    });

    logger.info(`✅ Generated and saved insights for user ${req.user.userId}`);

    res.status(200).json({
      insights: savedInsight.insights,
      summary: savedInsight.summary,
      generatedAt: savedInsight.generatedAt,
      cached: false,
    });
  } catch (error) {
    logger.error('Get insights error:', error);
    res.status(500).json({ error: 'Failed to generate insights' });
  }
};
