import { model, Schema } from 'mongoose';

export interface ITag {
  _id: string;
  name: string;
}

const tagSchema = new Schema<ITag>({
  name: { type: String, required: true },
});
// model() constructor: creates and registers  a model - returns a function that we can interact with
const Tag = model<ITag>('Tag', tagSchema);

export default Tag;
