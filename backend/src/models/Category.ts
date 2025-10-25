import mongoose, { Schema, Document } from 'mongoose';
import { ICategory } from '../types';

type ICategoryDocument = ICategory & Document;

const categorySchema = new Schema<ICategoryDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    color: {
      type: String,
      default: '#3b82f6',
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model<ICategoryDocument>('Category', categorySchema);

export default Category;
