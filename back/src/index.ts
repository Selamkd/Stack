import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from './utils/logger';
dotenv.config();
const app: Express = express();
const port = process.env.PORT || 8080;

const DB_URI = process.env.DB_CONNECTION_KEY;

app.use(cors());
app.use(express.json());

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
