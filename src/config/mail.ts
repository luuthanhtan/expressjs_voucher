import dotenv from 'dotenv';

dotenv.config();

export const emailConfig = {
  host: process.env.MAIL_HOST || 'sandbox.smtp.mailtrap.io',
  port: process.env.MAIL_PORT || 2525,
  password: process.env.MAIL_PASS || '',
  user: process.env.MAIL_USER || '',
};