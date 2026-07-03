import { model, Schema } from 'mongoose';

export interface ITodo {
  _id: string;
  text: string;
  done: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const todoSchema = new Schema<ITodo>(
  {
    text: { type: String, required: true },
    done: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Todo = model<ITodo>('Todo', todoSchema);

export default Todo;
