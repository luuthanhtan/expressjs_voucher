import logger from 'jet-logger';
import { appConfig } from '../config/app';
import mongoose from 'mongoose';

const MONGODB_URI: string = appConfig.mongoUri;

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.err('MongoDB connection error:', error);
    process.exit(1);
  }
};