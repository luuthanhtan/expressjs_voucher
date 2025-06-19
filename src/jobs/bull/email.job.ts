import { sendMail } from "utils/mailer";
import { Worker, Job } from "bullmq";
import { getRedisClient } from "utils/redis";

export const mailWorker = new Worker(
  "emailQueue",
  async (job: Job) => {
    const { to, subject, html } = job.data;
    await sendMail(to, subject, html);
    console.log(`📬 Mail sent to ${to}`);
  },
  {
    connection: getRedisClient(),
  }
);
