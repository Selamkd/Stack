import { Request, Response } from 'express';
import BoardDoc from '../models/boarddoc.model';
import logger from '../utils/logger';

export const getBoardDoc = async (req: Request, res: Response) => {
  try {
    const doc = await BoardDoc.findOne({ key: req.params.key }).lean();

    if (!doc) {
      res.status(404).json({ message: 'Board doc not found' });
      return;
    }

    res.status(200).json(doc);
  } catch (error) {
    logger.error('Failed to fetch board doc:', error);
    res.status(500).json({ message: 'Error fetching board doc', error });
  }
};

export const upsertBoardDoc = async (req: Request, res: Response) => {
  try {
    const { key, content } = req.body;

    if (!key) {
      res.status(400).json({ message: 'Key is required' });
      return;
    }

    const doc = await BoardDoc.findOneAndUpdate(
      { key },
      { $set: { content: content || '' } },
      { upsert: true, new: true }
    );

    res.status(200).json(doc);
  } catch (error) {
    logger.error('Error saving board doc:', error);
    res.status(500).json({ message: 'Error saving board doc', error });
  }
};
