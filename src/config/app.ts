import dotenv from 'dotenv';
import 'dotenv/config';

dotenv.config();

export const appConfig = {
  port: Number(process.env.PORT) || 3000,
  env: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || '',
  dbName: process.env.DB_NAME || '',
  jwtSecret: process.env.JWT_SECRET || '',
  jetLogger: {
    mode: process.env.JET_LOGGER_MODE || 'FILE',
    filePath: process.env.JET_LOGGER_FILEPATH || 'logs/app.log',
    timestamp: process.env.JET_LOGGER_TIMESTAMP === 'TRUE',
    format: process.env.JET_LOGGER_FORMAT === 'LINE',
  }
};