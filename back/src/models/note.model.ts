import { model, Schema } from 'mongoose';
import { ITag } from './tag.model';
import { ICategory } from './category.model';

export interface INote {
  _id: string;
  category: ICategory;
  title: string;
  content: string;
  tags?: ITag[];
  isStarred: boolean;
  createdAt?: Date;
  lastEdited?: Date;
}

const noteSchema = new Schema<INote>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: false },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    isStarred: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Note = model<INote>('Note', noteSchema);

export default Note;
