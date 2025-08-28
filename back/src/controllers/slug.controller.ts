import Slug from '../models/slug.model';
import { Request, Response } from 'express';
import logger from '../utils/logger';
export const getAllSlugs = async (req: Request, res: Response) => {
  try {
    const slugs = await Slug.find();

    res.status(200).json(slugs);
  } catch (error) {
    logger.error('Failed to fetpch slugs:', error);
    res.status(500).json({ message: 'Error fetching slugs', error });
  }
};
