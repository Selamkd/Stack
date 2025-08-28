import { model, Schema } from 'mongoose';

export interface ISlug {
  _id: string;
  id: string;
  name: string;
  level: string;
  completed?: boolean;
}

const slugSchema = new Schema<ISlug>(
  {
    id: { type: String },
    name: { type: String, required: true },
    level: { type: String, required: true },
    completed: { type: Boolean },
  },

  { timestamps: true }
);

const Slug = model<ISlug>('Slug', slugSchema);

export default Slug;
