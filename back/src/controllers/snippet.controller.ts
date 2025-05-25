import { Request, Response } from 'express';
import Snippet, { ISnippet } from '../models/snippet.model';
import mongoose, { FilterQuery } from 'mongoose';
import Category from '../models/category.model';

export const getAllSnippets = async (req: Request, res: Response) => {
  try {
    const query: FilterQuery<ISnippet> = {};
    if (req.query.tag) {
      query.tags = req.query.tag;
    }

    if (req.query.isStarred) {
      query.isStarred = req.query.isStarred === 'true';
    }

    const snippets = await Snippet.find(query).sort({ updatedAt: -1 });

    res.status(200).json(snippets);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error fetching snippets', error });
  }
};

export const getSnippetById = async (req: Request, res: Response) => {
  try {
    const snippet = await Snippet.findById(req.params.id);

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
    const { title, description, code, tags, isStarred, category, language } =
      req.body;
    const tagIds = Array.isArray(tags)
      ? tags.map((tag: any) => (typeof tag === 'object' ? tag._id : tag))
      : [];

    if (req.body._id) {
      const updatedSnippet = await Snippet.findByIdAndUpdate(
        req.body._id,
        { $set: req.body },
        { new: true }
      )
      .populate('category');

      res.status(200).json(updatedSnippet);
    } else {
      console.log(category);
      console.log(tags);
      console.log(typeof category);
      console.log(tags);
      console.log('---test adding category count', req.body);
      const newSnippet = new Snippet({
        title,
        description,
        code,
        language,
        category: category._id,

        isStarred: isStarred || false,
      });

      const savedSnippet = await newSnippet.save();
      const populatedSnippet = await Snippet.findById(savedSnippet._id);

      await Category.findByIdAndUpdate(category._id, { $inc: { count: 1 } });

      res.status(201).json(populatedSnippet);
    }
  } catch (error) {
    console.log(error);
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
