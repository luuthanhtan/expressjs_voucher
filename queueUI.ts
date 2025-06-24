import { emailQueue } from './src/queues/bullQueue';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';

const queueDashboard = new ExpressAdapter();
queueDashboard.setBasePath('/admin/queues');

createBullBoard({
  queues: [new BullMQAdapter(emailQueue)],
  serverAdapter: queueDashboard,
});

export default queueDashboard;
