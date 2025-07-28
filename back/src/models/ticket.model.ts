import { model, Schema } from 'mongoose';

export interface ITicket {
  _id: string;
  title: string;
  description?: string;
  stage: 'backlog' | 'development' | 'done' | 'parked';
}

const ticketSchema = new Schema<ITicket>(
  {
    title: { type: String, required: true },
    description: { type: String },

    stage: { type: String, default: 'backlog', required: true },
  },
  {
    timestamps: true,
  }
);

const Ticket = model<ITicket>('Ticket', ticketSchema);

export default Ticket;
