import { emailQueue } from './queues/bullQueue';

(async () => {
  await emailQueue.add({
    to: 'test@example.com',
    subject: 'Hello from Bull',
    html: '<p>This is a test email</p>',
  });

  console.log('📨 Email job added');
})();