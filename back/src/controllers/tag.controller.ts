import { Request, Response } from 'express';
import Tag from '../models/tag.model';
import logger from '../utils/logger';

export const getAllTags = async (req: Request, res: Response) => {
  try {
    logger.debug('Fetching all tags');

    const tags = await Tag.find().sort({ name: 1 });

    logger.info(`Retrieved ${tags.length} tags successfully`);
    res.status(200).json(tags);
  } catch (error) {
    logger.error('Failed to fetch tags:', error);
    res.status(500).json({ message: 'Error fetching tags', error });
  }
};

export const getTagById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    logger.debug('Fetching tag by ID:', id);

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
    const { name } = req.body;

    if (!name) {
      logger.warn('Missing tag name in request');
      res.status(400).json({ message: 'Tag name is required' });
      return;
    }

    logger.debug('Checking if tag exists:', name);
    const existingTag = await Tag.findOne({ name });

    if (existingTag) {
      logger.info(
        `Tag already exists with name: ${name}, ID: ${existingTag._id}`
      );
      res.status(200).json(existingTag);
      return;
    }

    logger.debug('Creating new tag:', name);
    const newTag = new Tag({ name });
    const savedTag = await newTag.save();

    logger.info('New tag created successfully:', savedTag._id);
    res.status(201).json(savedTag);
  } catch (error) {
    logger.error('Error creating tag:', error);
    res.status(500).json({ message: 'Error creating tag', error });
  }
};

export const updateTag = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      logger.warn('Missing tag name in update request');
      res.status(400).json({ message: 'Tag name is required' });
      return;
    }

    logger.debug(`Updating tag ${id} to name: ${name}`);

    const existingTag = await Tag.findOne({ name, _id: { $ne: id } });
    if (existingTag) {
      logger.warn(
        `Cannot update tag: name "${name}" already exists for another tag`
      );
      res.status(400).json({ message: 'Tag name already exists' });
      return;
    }

    const updatedTag = await Tag.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );

    if (!updatedTag) {
      logger.warn('Tag not found for update with ID:', id);
      res.status(404).json({ message: 'Tag not found' });
      return;
    }

    logger.info('Tag updated successfully:', id);
    res.status(200).json(updatedTag);
  } catch (error) {
    logger.error(`Error updating tag with ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error updating tag', error });
  }
};

export const deleteTag = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    logger.debug('Deleting tag with ID:', id);

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
