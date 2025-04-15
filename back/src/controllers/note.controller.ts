import { Request, Response } from 'express';
import Note, { INote } from '../models/note.model';

import mongoose, { FilterQuery } from 'mongoose';

export const getAllNotes = async (req: Request, res: Response) => {
  try {
    const query: FilterQuery<INote> = {};
    if (req.body.tag) {
      query.tags = req.body.tag;
    }

    if (req.body.isStarred) {
      query.isStarred = req.body.isStarred === 'true';
    }

    const notes = await Note.find(query)
      .populate('tags')
      .sort({ updatedAt: -1 });

    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notes', error });
  }
};

export const getNoteById = async (req: Request, res: Response) => {
  try {
    const note = await Note.findById(req.params.id).populate('tags');

    if (!note) {
      res.status(404).json({ message: 'Note not found' });
      return;
    }

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching note', error });
  }
};

export const createNote = async (req: Request, res: Response) => {
  try {
    const { title, content, tags, isStarred } = req.body;

    if (req.body._id) {
      const updatedNote = await Note.findByIdAndUpdate(
        req.body._id,
        { $set: req.body },
        { new: true }
      ).populate('tags');

      res.status(200).json(updatedNote);
    } else {
      const newNote = new Note({
        title,
        content,
        tags: tags || [],
        isStarred: isStarred || false,
      });

      const savedNote = await newNote.save();
      const populatedNote = await Note.findById(savedNote._id).populate('tags');

      res.status(201).json(populatedNote);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error creating note', error });
  }
};
export const deleteNote = async (req: Request, res: Response) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);

    if (!deletedNote) {
      res.status(404).json({ message: 'Note not found' });
      return;
    }

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting note', error });
  }
};

export const toggleStarred = async (req: Request, res: Response) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      res.status(404).json({ message: 'Note not found' });
      return;
    }

    note.isStarred = !note.isStarred;
    const updatedNote = await note.save();

    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: 'Error toggling starred status', error });
  }
};
