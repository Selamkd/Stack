import { Request, Response } from 'express';
import Snippet, { ISnippet } from '../models/snippet.model';
import mongoose, { FilterQuery } from 'mongoose';

export const getAllSnippets = async (req: Request, res: Response) => {
  try {
    const query: FilterQuery<ISnippet> = {};
    if (req.query.tag) {
      query.tags = req.query.tag;
    }

    if (req.query.isStarred) {
      query.isStarred = req.query.isStarred === 'true';
    }

    const snippets = await Snippet.find(query)
      .populate('tags')
      .sort({ updatedAt: -1 });

    res.status(200).json(snippets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching snippets', error });
  }
};

export const getSnippetById = async (req: Request, res: Response) => {
  try {
    const snippet = await Snippet.findById(req.params.id).populate('tags');

    if (!snippet) {
      res.status(404).json({ message: 'Snippet not found' });
      return;
    }

    res.status(200).json(snippet);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching snippet', error });
  }
};

export const upsertSnippet = async (req: Request, res: Response) => {
  try {
    const { title, description, code, tags, isStarred } = req.body;

    if (req.body._id) {
      const updatedSnippet = await Snippet.findByIdAndUpdate(
        req.body._id,
        { $set: req.body },
        { new: true }
      ).populate('tags');

      res.status(200).json(updatedSnippet);
    } else {
      const newSnippet = new Snippet({
        title,
        description,
        code,
        tags: tags || [],
        isStarred: isStarred || false,
      });

      const savedSnippet = await newSnippet.save();
      const populatedSnippet = await Snippet.findById(
        savedSnippet._id
      ).populate('tags');

      res.status(201).json(populatedSnippet);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error creating snippet', error });
  }
};

export const deleteSnippet = async (req: Request, res: Response) => {
  try {
    const deletedSnippet = await Snippet.findByIdAndDelete(req.params.id);

    if (!deletedSnippet) {
      res.status(404).json({ message: 'Snippet not found' });
      return;
    }

    res.status(200).json({ message: 'Snippet deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting snippet', error });
  }
};

export const toggleStarred = async (req: Request, res: Response) => {
  try {
    const snippet = await Snippet.findById(req.params.id);

    if (!snippet) {
      res.status(404).json({ message: 'Snippet not found' });
      return;
    }

    snippet.isStarred = !snippet.isStarred;
    const updatedSnippet = await snippet.save();

    res.status(200).json(updatedSnippet);
  } catch (error) {
    res.status(500).json({ message: 'Error toggling starred status', error });
  }
};
