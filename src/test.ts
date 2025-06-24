import { emailQueue } from './queues/bullQueue';
import './jobs/bull/email.job';

(async () => {
  await emailQueue.add('sendmail',{
    to: 'test@example.com',
    subject: 'Hello from Bull',
    html: '<p>This is a test email</p>',
  });

  console.log('📨 Email job added');
})();