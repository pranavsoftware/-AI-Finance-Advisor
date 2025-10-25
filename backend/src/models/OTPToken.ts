import mongoose, { Schema, Document } from 'mongoose';
import { IOTPToken } from '../types';

type IOTPTokenDocument = IOTPToken & Document;

const otpTokenSchema = new Schema<IOTPTokenDocument>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    code: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index - auto delete after expiry
    },
    attempts: {
      type: Number,
      default: 0,
      max: 3,
    },
  },
  {
    timestamps: true,
  }
);

const OTPToken = mongoose.model<IOTPTokenDocument>('OTPToken', otpTokenSchema);

export default OTPToken;
