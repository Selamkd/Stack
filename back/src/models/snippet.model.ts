import { model, Schema } from 'mongoose';
import { ITag } from './tag.model';
import { ICategory } from './category.model';

export interface ISnippet {
  _id: string;
  category?: ICategory;
  title: string;
  description?: string;
  language?: string;
  code: string;
  tags?: ITag[];
  isStarred?: boolean;
  createdAt: Date;
  lastEdited: Date;
}

const snippetSchema = new Schema<ISnippet>(
  {
    title: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    description: { type: String, required: false },
    language: { type: String },
    code: { type: String, required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    isStarred: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

const Snippet = model<ISnippet>('Snippet', snippetSchema);

export default Snippet;
