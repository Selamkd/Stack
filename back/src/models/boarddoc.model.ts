import { model, Schema } from 'mongoose';

export interface IBoardDoc {
  _id: string;
  key: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const boardDocSchema = new Schema<IBoardDoc>(
  {
    key: { type: String, required: true, unique: true },
    content: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

const BoardDoc = model<IBoardDoc>('BoardDoc', boardDocSchema);

export default BoardDoc;
