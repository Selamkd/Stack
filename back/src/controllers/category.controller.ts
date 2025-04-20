import { Request, Response } from 'express';
import Category from '../models/category.model';
import logger from '../utils/logger';

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json(categories);
  } catch (error) {
    logger.error('Failed to fetch categories:', error);
    res.status(500).json({ message: 'Error fetching categories', error });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      logger.warn('Category not found with ID:', id);
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    res.status(200).json(category);
  } catch (error) {
    logger.error(`Error fetching category with ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error fetching category', error });
  }
};

export const upsertCategory = async (req: Request, res: Response) => {
  try {
    const { _id, name } = req.body;
    if (!name) {
      logger.warn('Missing category name in request');
      res.status(400).json({ message: 'Category name is required' });
      return;
    }
    if (_id) {
      logger.info(`Category already exists with name: ${name}, ID: ${_id}`);
      const updatedCategory = await Category.findByIdAndUpdate(
        _id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedCategory);
      return;
    } else {
      const newCategory = new Category({ name });
      const savedCategory = await newCategory.save();
      logger.info('New category created successfully:', savedCategory._id);
      res.status(201).json(savedCategory);
    }
  } catch (error) {
    logger.error('Error creating category:', error);
    res.status(500).json({ message: 'Error creating category', error });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }
    logger.info('Category deleted successfully:', id);
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting category with ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error deleting category', error });
  }
};
