import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 8080;

const DB_URI = process.env.DB_CONNECTION_KEY;
