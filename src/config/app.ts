import dotenv from 'dotenv';

dotenv.config();

export const appConfig = {
  port: Number(process.env.PORT) || 3000,
  env: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || '',
  dbName: process.env.DB_NAME || '',
  jwtSecret: process.env.JWT_SECRET || '',
};