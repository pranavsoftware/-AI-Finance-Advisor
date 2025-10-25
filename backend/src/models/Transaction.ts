import mongoose, { Schema, Document } from 'mongoose';
import { ITransaction } from '../types';

type ITransactionDocument = ITransaction & Document;

const transactionSchema = new Schema<ITransactionDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: 'Uncategorized',
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
transactionSchema.index({ userId: 1, date: 1 });
transactionSchema.index({ userId: 1, category: 1 });

const Transaction = mongoose.model<ITransactionDocument>(
  'Transaction',
  transactionSchema
);

export default Transaction;
