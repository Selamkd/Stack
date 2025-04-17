import { model, Schema } from 'mongoose';
import { ITag } from './tag.model';
import { ICategory } from './category.model';

export interface IQuickLookup {
  _id: string;
  category: ICategory;
  title: string;
  answer: string;
  tags: ITag[];
  isStarred: boolean;
  createdAt: Date;
  lastEdited: Date;
}

const quickLookupSchema = new Schema<IQuickLookup>(
  {
    title: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    isStarred: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

const QuickLookup = model<IQuickLookup>('QuickLookup', quickLookupSchema);

export default QuickLookup;
