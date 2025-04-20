import { Request, Response } from 'express';
import Tag from '../models/tag.model';
import logger from '../utils/logger';

export const getAllTags = async (req: Request, res: Response) => {
  try {
    const tags = await Tag.find().sort({ name: 1 });

    res.status(200).json(tags);
  } catch (error) {
    logger.error('Failed to fetch tags:', error);
    res.status(500).json({ message: 'Error fetching tags', error });
  }
};

export const getTagById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const tag = await Tag.findById(id);

    if (!tag) {
      logger.warn('Tag not found with ID:', id);
      res.status(404).json({ message: 'Tag not found' });
      return;
    }

    logger.info('Tag retrieved successfully:', id);
    res.status(200).json(tag);
  } catch (error) {
    logger.error(`Error fetching tag with ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error fetching tag', error });
  }
};

export const upsertTag = async (req: Request, res: Response) => {
  try {
    const { _id, name } = req.body;

    if (!name) {
      logger.warn('Missing tag name in request');
      res.status(400).json({ message: 'Tag name is required' });
      return;
    }

    if (_id) {
      const updatedTag = await Tag.findByIdAndUpdate(
        _id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedTag);
      return;
    } else {
      const newTag = new Tag({ name });
      const savedTag = await newTag.save();

      logger.info('New tag created successfully:', savedTag._id);
      res.status(201).json(savedTag);
    }
  } catch (error) {
    logger.error('Error creating tag:', error);
    res.status(500).json({ message: 'Error creating tag', error });
  }
};

export const deleteTag = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedTag = await Tag.findByIdAndDelete(id);

    if (!deletedTag) {
      logger.warn('Tag not found for deletion with ID:', id);
      res.status(404).json({ message: 'Tag not found' });
      return;
    }

    logger.info('Tag deleted successfully:', id);
    res.status(200).json({ message: 'Tag deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting tag with ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error deleting tag', error });
  }
};
