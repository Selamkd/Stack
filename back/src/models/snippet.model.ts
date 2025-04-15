import { model, Schema } from 'mongoose';
import { ITag } from './tag.model';

export interface ISnippet {
  _id: string;
  title: string;
  description: string;
  code: string;
  tags: ITag[];
  isStarred: boolean;
}

const snippetSchema = new Schema<ISnippet>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
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
