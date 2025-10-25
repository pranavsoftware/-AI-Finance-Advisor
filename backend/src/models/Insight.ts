import mongoose, { Document, Schema } from 'mongoose';

export interface IInsight extends Document {
  userId: mongoose.Types.ObjectId;
  insights: string;
  summary: {
    totalSpend: number;
    monthlyAverage: number;
    transactionCount: number;
    topCategories: Array<{
      category: string;
      amount: number;
    }>;
    dateRange: {
      start: Date;
      end: Date;
    };
  };
  generatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const insightSchema = new Schema<IInsight>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    insights: {
      type: String,
      required: true,
    },
    summary: {
      totalSpend: {
        type: Number,
        required: true,
      },
      monthlyAverage: {
        type: Number,
        required: true,
      },
      transactionCount: {
        type: Number,
        required: true,
      },
      topCategories: [
        {
          category: String,
          amount: Number,
        },
      ],
      dateRange: {
        start: Date,
        end: Date,
      },
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for finding latest insight by user
insightSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IInsight>('Insight', insightSchema);
