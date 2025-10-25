import { Router } from 'express';
import {
  uploadTransactions,
  getTransactions,
  deleteTransaction,
  getTransactionStats,
} from '../controllers/transactionController';
import { authMiddleware } from '../middleware/auth';
import { uploadMiddleware, handleMulterError } from '../middleware/upload';

const router = Router();

/**
 * POST /api/transactions/upload
 * Upload transactions from CSV/Excel file
 */
router.post(
  '/upload',
  authMiddleware,
  uploadMiddleware.single('file'),
  handleMulterError,
  uploadTransactions
);

/**
 * GET /api/transactions
 * Get user's transactions with optional filters
 */
router.get('/', authMiddleware, getTransactions);

/**
 * DELETE /api/transactions/:id
 * Delete a transaction
 */
router.delete('/:id', authMiddleware, deleteTransaction);

/**
 * GET /api/transactions/stats
 * Get transaction statistics
 */
router.get('/stats', authMiddleware, getTransactionStats);

export default router;
