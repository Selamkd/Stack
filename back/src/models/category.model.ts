import { model, Schema } from 'mongoose';

export interface ICategory {
  _id: string;
  name: string;
  count: number;
  createdAt?: Date;
  lastEdited?: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    count: { type: Number, required: false },
  },

  { timestamps: true }
);

const Category = model<ICategory>('Category', categorySchema);

export default Category;
