import { emailQueue } from "queues/bullQueue";
import { sendMail } from "utils/mailer";

emailQueue.process(async (job) => {
  const { to, subject, html } = job.data;
  console.log(`Sending email to ${to}`);
  await sendMail(to, subject, html);
});
