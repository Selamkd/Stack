import { model, Schema } from 'mongoose';

export interface IChatMessage {
  role: 'user' | 'assistant';
  content: string;
  createdAt?: Date;
}

export interface IConversation {
  _id: string;
  title: string;
  messages: IChatMessage[];
  createdAt?: Date;
  updatedAt?: Date;
}

const messageSchema = new Schema<IChatMessage>(
  {
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const conversationSchema = new Schema<IConversation>(
  {
    title: { type: String, required: true, default: 'New conversation' },
    messages: { type: [messageSchema], default: [] },
  },
  {
    timestamps: true,
  }
);

const Conversation = model<IConversation>('Conversation', conversationSchema);

export default Conversation;
