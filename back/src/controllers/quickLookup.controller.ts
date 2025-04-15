import { Request, Response } from 'express';
import QuickLookup, { IQuickLookup } from '../models/quicklookup.model';
import mongoose, { FilterQuery } from 'mongoose';
export const getAllLookUps = async (req: Request, res: Response) => {
  try {
    const query: FilterQuery<IQuickLookup> = {};
    if (req.body.tag) {
      query.tags = req.body.tag;
    }

    if (req.body.isStarred) {
      query.isStarred = req.body.isStarred === 'true';
    }

    const lookups = await QuickLookup.find(query)
      .populate('tags')
      .sort({ updatedAt: -1 });

    res.status(200).json(lookups);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notes', error });
  }
};

export const getLookupById = async (req: Request, res: Response) => {
  try {
    const quickLookup = await QuickLookup.findById(req.params.id).populate(
      'tags'
    );

    if (!quickLookup) {
      res.status(404).json({ message: 'Quick lookup not found' });
      return;
    }

    res.status(200).json(quickLookup);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quick lookup', error });
  }
};

export const UpsertLookUp = async (req: Request, res: Response) => {
  try {
    const { title, answer, tags, isStarred } = req.body;

    if (req.body._id) {
      const updatedLookup = await QuickLookup.findByIdAndUpdate(
        req.body._id,
        { $set: req.body },
        { new: true }
      ).populate('tags');

      res.status(200).json(updatedLookup);
    } else {
      const newLookup = new QuickLookup({
        title,
        answer,
        tags: tags || [],
        isStarred: isStarred || false,
      });

      const savedLookup = await newLookup.save();
      const populatedLookup = await QuickLookup.findById(
        savedLookup._id
      ).populate('tags');

      res.status(201).json(populatedLookup);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error creating lookup', error });
  }
};

export const searchLookups = async (req: Request, res: Response) => {
  try {
    const searchTerm = req.query.term as string;

    if (!searchTerm) {
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
    }).populate('tags');

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error searching quick lookups', error });
  }
};

export const deleteQuickLookup = async (req: Request, res: Response) => {
  try {
    const deletedQuickLookup = await QuickLookup.findByIdAndDelete(
      req.params.id
    );

    if (!deletedQuickLookup) {
      res.status(404).json({ message: 'Quick lookup not found' });
      return;
    }

    res.status(200).json({ message: 'Quick lookup deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting quick lookup', error });
  }
};

export const toggleStarred = async (req: Request, res: Response) => {
  try {
    const quickLookup = await QuickLookup.findById(req.params.id);

    if (!quickLookup) {
      res.status(404).json({ message: 'Quick lookup not found' });
      return;
    }

    quickLookup.isStarred = !quickLookup.isStarred;
    const updatedQuickLookup = await quickLookup.save();

    res.status(200).json(updatedQuickLookup);
  } catch (error) {
    res.status(500).json({ message: 'Error toggling starred status', error });
  }
};
