import { model, Schema } from 'mongoose';

export interface ISticky {
  _id: string;
  text: string;
  color: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const stickySchema = new Schema<ISticky>(
  {
    text: { type: String, default: '' },
    color: { type: String, default: 'chalk-white' },
  },
  {
    timestamps: true,
  }
);

const Sticky = model<ISticky>('Sticky', stickySchema);

export default Sticky;
