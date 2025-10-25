import { Router } from 'express';
import { getInsights } from '../controllers/aiController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

/**
 * POST /api/ai/insights
 * Get AI-powered spending insights
 */
router.post('/insights', authMiddleware, getInsights);

export default router;
