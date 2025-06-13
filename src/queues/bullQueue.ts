import Bull from 'bull';
import { redisConfig } from 'config/redis';

export interface EmailJobData {
  to: string;
  subject: string;
  html: string;
}

export const emailQueue = new Bull<EmailJobData>('email-queue', {
  redis: {
    host: redisConfig.host,
    port: Number(redisConfig.port),
  },
});

export const pushEmailToQueue = async (data: EmailJobData) => {
  console.log('Pushing email to queue', data);
  await emailQueue.add(data, {
    attempts: 3,
    backoff: 5000,
  });
};
