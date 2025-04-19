import logger from '../utils/logger';
import dotenv from 'dotenv';
import { Request, Response } from 'express';

dotenv.config();
const ADMIN_PASS_KEY = process.env.ADMIN_KEY;

export const checkPass = async (req: Request, res: Response): Promise<void> => {
  try {
    const { pass } = req.body;

    if (!ADMIN_PASS_KEY) {
      throw new Error('Missing ADMIN_KEY');
    }

    if (!pass) {
      res.status(400).json({ message: 'Password is required' });
      return;
    }

    if (pass === ADMIN_PASS_KEY) {
      res.status(200).json({ message: ':)' });
    } else {
      res.status(401).json({ message: 'Password incorrect' });
    }
  } catch (error) {
    logger.error('Error checking password', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};
