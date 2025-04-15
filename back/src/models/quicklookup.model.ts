import { model, Schema } from 'mongoose';
import { ITag } from './tag.model';

export interface IQuickLookup {
  _id: string;
  title: string;
  answer: string;
  tags: ITag[];
  isStarred: boolean;
}

const quickLookupSchema = new Schema<IQuickLookup>(
  {
    title: { type: String, required: true },
    answer: { type: String, required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    isStarred: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

const QuickLookup = model<IQuickLookup>('QuickLookup', quickLookupSchema);

export default QuickLookup;
