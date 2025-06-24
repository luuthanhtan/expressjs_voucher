import { Queue } from 'bullmq';
import { getRedisClient } from '../utils/redis';

export interface EmailJobData {
  to: string;
  subject: string;
  html: string;
}
export const emailQueue = new Queue('emailQueue', {
  connection: getRedisClient(),
});

export const pushEmailToQueue = async (data: EmailJobData) => {
  console.log('Pushing email to queue: ', data.to);
  await emailQueue.add('sendMail', data);
};