import { model, Schema } from 'mongoose';

export interface ICategory {
  _id: string;
  name: string;
}

const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
});

const Category = model<ICategory>('Category', categorySchema);

export default Category;
