import { appConfig } from '../config/app';
import mongoose from 'mongoose';

const MONGODB_URI: string = appConfig.mongoUri;

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};