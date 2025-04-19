import { model, Schema } from 'mongoose';

export interface ICategory {
  _id: string;
  name: string;
  createdAt?: Date;
  lastEdited?: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
  },

  { timestamps: true }
);

const Category = model<ICategory>('Category', categorySchema);

export default Category;
