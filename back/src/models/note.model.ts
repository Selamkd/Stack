import { model, Schema } from 'mongoose';
import { ITag } from './tag.model';

export interface INote {
  _id: string;
  title: string;
  content: string;
  tags: ITag[];
  isStarred: boolean;
}

const noteSchema = new Schema<INote>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    isStarred: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

const Note = model<INote>('Note', noteSchema);

export default Note;
