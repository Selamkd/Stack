import { Request, Response } from 'express';
import QuickLookup, { IQuickLookup } from '../models/quicklookup.model';
import mongoose, { FilterQuery } from 'mongoose';
import logger from '../utils/logger';
import Category from '../models/category.model';

export const getAllLookUps = async (req: Request, res: Response) => {
  try {
    const query: FilterQuery<IQuickLookup> = {};

    if (req.query.tag) {
      query.tags = req.query.tag;
    }

    if (req.query.isStarred) {
      query.isStarred = req.query.isStarred === 'true';
    }

    const lookups = await QuickLookup.find(query)
      .populate('tags')
      .populate('category')
      .sort({ updatedAt: -1 });

    res.status(200).json(lookups);
  } catch (error) {
    logger.error('Failed to fetch quick lookups:', error);
    res.status(500).json({ message: 'Error fetching quick lookups', error });
  }
};

export const getLookupById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const quickLookup = await QuickLookup.findById(id).populate('tags');

    if (!quickLookup) {
      logger.warn('Quick lookup not found with ID:', id);
      res.status(404).json({ message: 'Quick lookup not found' });
      return;
    }

    logger.info('Quick lookup retrieved successfully:', id);
    res.status(200).json(quickLookup);
  } catch (error) {
    logger.error(
      `Error fetching quick lookup with ID ${req.params.id}:`,
      error
    );
    res.status(500).json({ message: 'Error fetching quick lookup', error });
  }
};

export const upsertLookUp = async (req: Request, res: Response) => {
  try {
    const { _id, title, answer, tags, isStarred, category } = req.body;

    if (_id) {
      const updatedLookup = await QuickLookup.findByIdAndUpdate(
        _id,
        { $set: req.body },
        { new: true, runValidators: true }
      )
        .populate('tags')
        .populate('category');

      if (!updatedLookup) {
        logger.warn('Quick lookup not found for update with ID:', _id);
        res.status(404).json({ message: 'Quick lookup not found' });
        return;
      }

      logger.info('Quick lookup updated successfully:', _id);
      res.status(200).json(updatedLookup);
    } else {
      if (!title || !answer) {
        logger.warn('Missing required fields for quick lookup creation');
        res.status(400).json({ message: 'Title and answer are required' });
        return;
      }

      const newLookup = new QuickLookup({
        title,
        answer,
        tags: tags || [],
        category,
        isStarred: isStarred || false,
      });

      const savedLookup = await newLookup.save();
      logger.info('New quick lookup created with ID:', savedLookup._id);

      const populatedLookup = await QuickLookup.findById(
        savedLookup._id
      ).populate('tags');

      await Category.findByIdAndUpdate(category._id, { $inc: { count: 1 } });
      res.status(201).json(populatedLookup);
    }
  } catch (error) {
    logger.error('Error creating/updating quick lookup:', error);

    res
      .status(500)
      .json({ message: 'Error creating/updating quick lookup', error });
  }
};

export const searchLookups = async (req: Request, res: Response) => {
  try {
    const searchTerm = req.query.term as string;
    logger.debug('Searching quick lookups with term:', searchTerm);

    if (!searchTerm) {
      logger.warn('Missing search term in request');
      res.status(400).json({ message: 'Search term is required' });
      return;
    }

    //returns lookups where title field contains search str(case-insensitive) or the answer field
    //$regex: searchTerm creates a regular expression pattern from the user's input
    //$options: 'i' applies the case-insensitive flag to the regex pattern(will match regardless of letter case)
    const results = await QuickLookup.find({
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { answer: { $regex: searchTerm, $options: 'i' } },
      ],
    })
      .populate('tags')
      .populate('category');

    res.status(200).json(results);
  } catch (error) {
    logger.error('Error searching quick lookups:', error);
    res.status(500).json({ message: 'Error searching quick lookups', error });
  }
};

export const deleteQuickLookup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedQuickLookup = await QuickLookup.findByIdAndDelete(id);

    if (!deletedQuickLookup) {
      logger.warn('Quick lookup not found for deletion with ID:', id);
      res.status(404).json({ message: 'Quick lookup not found' });
      return;
    }

    logger.info('Quick lookup deleted successfully:', id);
    res.status(200).json({ message: 'Quick lookup deleted successfully' });
  } catch (error) {
    logger.error(
      `Error deleting quick lookup with ID ${req.params.id}:`,
      error
    );
    res.status(500).json({ message: 'Error deleting quick lookup', error });
  }
};

export const toggleStarred = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const quickLookup = await QuickLookup.findById(id);

    if (!quickLookup) {
      logger.warn('Quick lookup not found for toggle starred with ID:', id);
      res.status(404).json({ message: 'Quick lookup not found' });
      return;
    }

    quickLookup.isStarred = !quickLookup.isStarred;
    const updatedQuickLookup = await quickLookup.save();

    res.status(200).json(updatedQuickLookup);
  } catch (error) {
    logger.error(
      `Error toggling starred status for quick lookup ID ${req.params.id}:`,
      error
    );
    res.status(500).json({ message: 'Error toggling starred status', error });
  }
};
