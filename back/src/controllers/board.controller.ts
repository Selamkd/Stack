import { Request, Response } from 'express';
import Sticky from '../models/sticky.model';
import Todo from '../models/todo.model';
import logger from '../utils/logger';

export const getAllStickies = async (req: Request, res: Response) => {
  try {
    const stickies = await Sticky.find().sort({ createdAt: 1 }).lean();
    res.status(200).json(stickies);
  } catch (error) {
    logger.error('Failed to fetch stickies:', error);
    res.status(500).json({ message: 'Error fetching stickies', error });
  }
};

export const upsertSticky = async (req: Request, res: Response) => {
  try {
    const { _id, text, color } = req.body;

    if (_id) {
      const updated = await Sticky.findByIdAndUpdate(
        _id,
        { $set: { text, color } },
        { new: true }
      );
      if (!updated) {
        res.status(404).json({ message: 'Sticky not found' });
        return;
      }
      res.status(200).json(updated);
    } else {
      const sticky = new Sticky({ text: text || '', color });
      const saved = await sticky.save();
      res.status(201).json(saved);
    }
  } catch (error) {
    logger.error('Error saving sticky:', error);
    res.status(500).json({ message: 'Error saving sticky', error });
  }
};

export const deleteSticky = async (req: Request, res: Response) => {
  try {
    const deleted = await Sticky.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: 'Sticky not found' });
      return;
    }
    res.status(200).json({ message: 'Sticky deleted successfully' });
  } catch (error) {
    logger.error('Error deleting sticky:', error);
    res.status(500).json({ message: 'Error deleting sticky', error });
  }
};

export const getAllTodos = async (req: Request, res: Response) => {
  try {
    const todos = await Todo.find().sort({ done: 1, createdAt: -1 }).lean();
    res.status(200).json(todos);
  } catch (error) {
    logger.error('Failed to fetch todos:', error);
    res.status(500).json({ message: 'Error fetching todos', error });
  }
};

export const upsertTodo = async (req: Request, res: Response) => {
  try {
    const { _id, text, done } = req.body;

    if (_id) {
      const updated = await Todo.findByIdAndUpdate(
        _id,
        { $set: { text, done } },
        { new: true }
      );
      if (!updated) {
        res.status(404).json({ message: 'Todo not found' });
        return;
      }
      res.status(200).json(updated);
    } else {
      if (!text) {
        res.status(400).json({ message: 'Todo text is required' });
        return;
      }
      const todo = new Todo({ text });
      const saved = await todo.save();
      res.status(201).json(saved);
    }
  } catch (error) {
    logger.error('Error saving todo:', error);
    res.status(500).json({ message: 'Error saving todo', error });
  }
};

export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const deleted = await Todo.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: 'Todo not found' });
      return;
    }
    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    logger.error('Error deleting todo:', error);
    res.status(500).json({ message: 'Error deleting todo', error });
  }
};

export const clearDoneTodos = async (req: Request, res: Response) => {
  try {
    await Todo.deleteMany({ done: true });
    res.status(200).json({ message: 'Completed todos cleared' });
  } catch (error) {
    logger.error('Error clearing todos:', error);
    res.status(500).json({ message: 'Error clearing todos', error });
  }
};
