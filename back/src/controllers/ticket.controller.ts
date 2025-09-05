import { Request, Response } from 'express';
import Tag from '../models/tag.model';
import logger from '../utils/logger';
import Ticket from '../models/ticket.model';

export const getAllTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: 1 });

    res.status(200).json(tickets);
  } catch (error) {
    logger.error('Failed to fetch tickets:', error);

    res.status(500).json({ message: 'Error fetching tickets', error });
  }
};

export const getTicketById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      logger.warn('Ticket not found with ID:', id);
      res.status(404).json({ message: 'Ticket not found' });
      return;
    }

    logger.info('Ticket retrieved successfully:', id);
    res.status(200).json(ticket);
  } catch (error) {
    logger.error(`Error fetching ticket with ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error fetching ticket', error });
  }
};

export const upsertTicket = async (req: Request, res: Response) => {
  try {
    const { _id, title, description, stage } = req.body;

    if (!title) {
      logger.warn('Missing title in request');
      res.status(400).json({ message: 'Ticket title is required' });
      return;
    }

    if (_id !== 'new') {
      const updatedTicket = await Ticket.findByIdAndUpdate(
        _id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedTicket);
      return;
    } else {
      const newTicket = new Ticket({
        title: title,
        description: description,
        stage: stage,
      });
      const savedTicket = await newTicket.save();

      logger.info('New ticket created successfully:', savedTicket._id);
      res.status(201).json(savedTicket);
    }
  } catch (error) {
    logger.error('Error creating ticket:', error);
    res.status(500).json({ message: 'Error creating ticket', error });
  }
};

export const deleteTicket = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedTicket = await Ticket.findByIdAndDelete(id);

    if (!deletedTicket) {
      logger.warn('Ticket not found for deletion with ID:', id);
      res.status(404).json({ message: 'Ticket not found' });
      return;
    }

    logger.info('Ticket deleted successfully:', id);
    res.status(200).json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting ticket with ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error deleting ticket', error });
  }
};
