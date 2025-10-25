import { Router } from 'express';
import { getPredictedSpending } from '../controllers/mlController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

/**
 * GET /api/ml/predict
 * Get spending predictions from ML service
 */
router.get('/predict', authMiddleware, getPredictedSpending);

export default router;
