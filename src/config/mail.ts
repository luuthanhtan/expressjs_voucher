import dotenv from 'dotenv';

dotenv.config();

export const emailConfig = {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  password: process.env.MAIL_USER,
  user: process.env.MAIL_PASS,
};