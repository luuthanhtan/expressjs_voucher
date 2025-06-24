import { seedEvents } from "./seed-event";
import { seedUsers } from "./seed-user";
import { seedVouchers } from "./seed-voucher";
import logger from 'jet-logger';

(async () => {
  try {
    await seedUsers();
    await seedEvents();
    await seedVouchers();
    logger.info('Run seeders completed');
    process.exit(0);
  } catch (err) {
    logger.err('Error seeding data:', err);
    process.exit(1);
  }
})();
