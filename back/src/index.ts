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

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3001',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'https://stack-gules-five.vercel.app',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use('/api', apiRouter);

if (!DB_URI) {
  logger.error('Unable to find connection string');
}

async function connectToDB() {
  try {
    if (!DB_URI) {
      throw new Error('Database connection string is undefined');
    }
    await mongoose.connect(DB_URI);

    app.listen(port, () => {
      logger.info(`Server started on port: ${port}`);
    });
  } catch (error) {
    logger.error(`Failed to start the server: ${error}`);
  }
}

app.use((req, res, next) => {
  console.warn(`[404] Not found: ${req.method} ${req.url}`);
  res.status(404).json({ error: 'Not found' });
});

connectToDB();
