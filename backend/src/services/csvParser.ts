import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import logger from '../utils/logger';
import { parseDate } from '../utils/helpers';

export interface ParsedTransaction {
  date: Date;
  amount: number;
  description: string;
}

export interface ParseResult {
  transactions: ParsedTransaction[];
  errors: Array<{ row: number; error: string }>;
}

/**
 * Parse CSV file content
 */
export const parseCSV = (fileContent: string): ParseResult => {
  const errors: Array<{ row: number; error: string }> = [];
  const transactions: ParsedTransaction[] = [];

  try {
    const parsed = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
    });

    if (parsed.errors && parsed.errors.length > 0) {
      logger.warn('CSV parsing warnings:', parsed.errors);
    }

    const rows = parsed.data as Record<string, any>[];

    rows.forEach((row, index) => {
      try {
        const date = row.date || row.Date;
        const amount = row.amount || row.Amount;
        const description = row.description || row.Description || row.merchant || row.Merchant;

        if (!date || !amount || !description) {
          errors.push({
            row: index + 2,
            error: 'Missing required fields (date, amount, description)',
          });
          return;
        }

        const parsedDate = parseDate(date.toString());
        if (!parsedDate) {
          errors.push({
            row: index + 2,
            error: `Invalid date format: ${date}. Use YYYY-MM-DD`,
          });
          return;
        }

        const parsedAmount = parseFloat(amount.toString());
        if (isNaN(parsedAmount) || parsedAmount < 0) {
          errors.push({
            row: index + 2,
            error: `Invalid amount: ${amount}`,
          });
          return;
        }

        transactions.push({
          date: parsedDate,
          amount: parsedAmount,
          description: description.toString().trim(),
        });
      } catch (error) {
        errors.push({
          row: index + 2,
          error: `Error parsing row: ${(error as Error).message}`,
        });
      }
    });

    logger.info(`✅ CSV parsed: ${transactions.length} transactions, ${errors.length} errors`);
    return { transactions, errors };
  } catch (error) {
    logger.error('Error parsing CSV:', error);
    return {
      transactions: [],
      errors: [{ row: 0, error: `CSV parsing failed: ${(error as Error).message}` }],
    };
  }
};

/**
 * Parse Excel file buffer
 */
export const parseExcel = (buffer: Buffer): ParseResult => {
  const errors: Array<{ row: number; error: string }> = [];
  const transactions: ParsedTransaction[] = [];

  try {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet);

    (rows as Record<string, any>[]).forEach((row, index) => {
      try {
        const dateCol = Object.keys(row).find(
          (k) => k.toLowerCase() === 'date'
        );
        const amountCol = Object.keys(row).find(
          (k) => k.toLowerCase() === 'amount'
        );
        const descCol = Object.keys(row).find(
          (k) =>
            k.toLowerCase() === 'description' || k.toLowerCase() === 'merchant'
        );

        if (!dateCol || !amountCol || !descCol) {
          errors.push({
            row: index + 2,
            error: 'Missing required columns (date, amount, description/merchant)',
          });
          return;
        }

        const date = row[dateCol];
        const amount = row[amountCol];
        const description = row[descCol];

        let parsedDate: Date;
        if (typeof date === 'number') {
          // Excel serial date
          parsedDate = new Date((date - 25569) * 86400 * 1000);
        } else {
          parsedDate = parseDate(date.toString()) || new Date(date);
        }

        if (isNaN(parsedDate.getTime())) {
          errors.push({
            row: index + 2,
            error: `Invalid date: ${date}`,
          });
          return;
        }

        const parsedAmount = parseFloat(amount.toString());
        if (isNaN(parsedAmount) || parsedAmount < 0) {
          errors.push({
            row: index + 2,
            error: `Invalid amount: ${amount}`,
          });
          return;
        }

        transactions.push({
          date: parsedDate,
          amount: parsedAmount,
          description: description.toString().trim(),
        });
      } catch (error) {
        errors.push({
          row: index + 2,
          error: `Error parsing row: ${(error as Error).message}`,
        });
      }
    });

    logger.info(
      `✅ Excel parsed: ${transactions.length} transactions, ${errors.length} errors`
    );
    return { transactions, errors };
  } catch (error) {
    logger.error('Error parsing Excel:', error);
    return {
      transactions: [],
      errors: [{ row: 0, error: `Excel parsing failed: ${(error as Error).message}` }],
    };
  }
};

/**
 * Detect file type and parse accordingly
 */
export const parseFile = (
  buffer: Buffer,
  filename: string
): ParseResult => {
  const ext = filename.split('.').pop()?.toLowerCase();

  if (ext === 'csv') {
    return parseCSV(buffer.toString('utf-8'));
  } else if (ext === 'xlsx' || ext === 'xls') {
    return parseExcel(buffer);
  } else {
    return {
      transactions: [],
      errors: [{ row: 0, error: 'Unsupported file format. Use CSV or Excel.' }],
    };
  }
};
