import multer from 'multer';
import path from 'path';
import logger from '../utils/logger';

const uploadDir = process.env.UPLOAD_DIR || './uploads';
const maxFileSize = parseInt(process.env.MAX_FILE_SIZE || '5242880'); // 5MB default

/**
 * Configure multer for file uploads
 */
const storage = multer.memoryStorage();

const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
): void => {
  const allowedMimes = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];

  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowedMimes.includes(file.mimetype) && ext !== '.csv' && ext !== '.xlsx' && ext !== '.xls') {
    cb(new Error('Only CSV and Excel files are allowed'));
    return;
  }

  cb(null, true);
};

export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: { fileSize: maxFileSize },
});

/**
 * Handle multer errors
 */
export const handleMulterError = (
  error: any,
  req: any,
  res: any,
  next: any
): void => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({ error: `File size exceeds ${maxFileSize / 1024 / 1024}MB limit` });
    } else if (error.code === 'LIMIT_FILE_COUNT') {
      res.status(400).json({ error: 'Only one file allowed' });
    } else {
      res.status(400).json({ error: error.message });
    }
  } else if (error) {
    res.status(400).json({ error: error.message });
  } else {
    next();
  }
};
