import express, { Express } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from './utils/logger';

import apiRouter from './routes/app.routes';

dotenv.config();

const app: Express = express();

app.use(express.json({ limit: '10mb' }));
const port = process.env.PORT || 3001;

const DB_URI = process.env.DB_CONNECTION_KEY;

app.use(cors())
app.use(express.json());
app.use('/api', apiRouter);

if (!DB_URI) {
  logger.error('Unable to find connection string');
}

async function connectToDB() {
  try {
    if (!DB_URI) {
      throw new Error('Database URI not provided');
    }

    await mongoose.connect(DB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });

    logger.info('Connected to MongoDB');

    app.listen(port, () => {
      logger.info(`Server started on port: ${port}`);
    });
  } catch (error) {
    logger.error(`Failed to start the server: ${error}`);
    process.exit(1);
  }
}

app.use((req, res, next) => {
  console.warn(`[404] Not found: ${req.method} ${req.url}`);
  res.status(404).json({ error: 'Not found' });
});

connectToDB();
