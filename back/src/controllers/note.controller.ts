import { Request, Response } from 'express';
import Note, { INote } from '../models/note.model';
import mongoose, { FilterQuery } from 'mongoose';
import logger from '../utils/logger';
import Category from '../models/category.model';

export const getAllNotes = async (req: Request, res: Response) => {
  try {
    const query: FilterQuery<INote> = {};

    if (req.query.tag) {
      query.tags = req.query.tag;
    }

    if (req.query.isStarred) {
      query.isStarred = req.query.isStarred === 'true';
    }

    const notes = await Note.find(query)

      .populate('category')
      .sort({ updatedAt: -1 });

    res.status(200).json(notes);
  } catch (error) {
    logger.error('Failed to fetch notes:', error);
    res.status(500).json({ message: 'Error fetching notes', error });
  }
};

export const getNoteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const note = await Note.findById(id);

    if (!note) {
      logger.warn('Note not found with ID:', id);
      res.status(404).json({ message: 'Note not found' });
      return;
    }

    res.status(200).json(note);
  } catch (error) {
    logger.error(`Error fetching note with ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error fetching note', error });
  }
};

export const upsertNote = async (req: Request, res: Response) => {
  try {
    const { _id, title, content, tags, isStarred, category } = req.body;

    if (_id) {
      const updatedNote = await Note.findByIdAndUpdate(
        _id,
        { $set: req.body },
        { new: true, runValidators: true }
      );

      if (!updatedNote) {
        logger.warn('Note not found for update with ID:', _id);
        res.status(404).json({ message: 'Note not found' });
        return;
      }

      logger.info('Note updated successfully:', _id);
      res.status(200).json(updatedNote);
    } else {
      if (!title || !content) {
        logger.warn('Missing required fields for note creation');
        res.status(400).json({ message: 'Title and content are required' });
        return;
      }

      const newNote = new Note({
        title,
        content,
        category,
        tags: tags || [],
        isStarred: isStarred || false,
      });

      const savedNote = await newNote.save();

      const populatedNote = await Note.findById(savedNote._id)
      .populate('category');

      await Category.findByIdAndUpdate(category._id, { $inc: { count: 1 } });
      res.status(201).json(populatedNote);
    }
  } catch (error) {
    logger.error('Error creating/updating note:', error);

    res.status(500).json({ message: 'Error creating/updating note', error });
  }
};

export const deleteNote = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedNote = await Note.findByIdAndDelete(id);

    if (!deletedNote) {
      logger.warn('Note not found for deletion with ID:', id);
      res.status(404).json({ message: 'Note not found' });
      return;
    }

    logger.info('Note deleted successfully:', id);
    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting note with ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error deleting note', error });
  }
};

export const toggleStarred = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const note = await Note.findById(id);

    if (!note) {
      logger.warn('Note not found for toggle starred with ID:', id);
      res.status(404).json({ message: 'Note not found' });
      return;
    }

    note.isStarred = !note.isStarred;
    const updatedNote = await note.save();

    res.status(200).json(updatedNote);
  } catch (error) {
    logger.error(
      `Error toggling starred status for note ID ${req.params.id}:`,
      error
    );
    res.status(500).json({ message: 'Error toggling starred status', error });
  }
};
