import { Request, Response } from 'express';
import Tag from '../models/tag.model';

export const getAllTags = async (req: Request, res: Response) => {
  try {
    const tags = await Tag.find().sort({ name: 1 });
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tags', error });
  }
};

export const getTagById = async (req: Request, res: Response) => {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) {
      res.status(404).json({ message: 'Tag not found' });
      return;
    }
    res.status(200).json(tag);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tag', error });
  }
};

export const createTag = async (req: Request, res: Response) => {
  try {
    const existingTag = await Tag.findOne({ name: req.body._id });
    if (existingTag) {
      const updatedTag = await Tag.findByIdAndUpdate(
        req.params.id,
        { name: req.body },
        { new: true }
      );

      updatedTag?.save();
      res.status(200).json(updatedTag);
    }

    const newTag = new Tag(req.body);
    const savedTag = await newTag.save();
    res.status(201).json(savedTag);
  } catch (error) {
    res.status(500).json({ message: 'Error creating tag', error });
  }
};

export const deleteTag = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedTag = await Tag.findByIdAndDelete(req.params.id);

    if (!deletedTag) {
      res.status(404).json({ message: 'Tag not found' });
      return;
    }

    res.status(200).json({ message: 'Tag deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting tag', error });
  }
};
