import { seedEvents } from "./seed-event";
import { seedUsers } from "./seed-user";
import { seedVouchers } from "./seed-voucher";


(async () => {
  try {
    await seedUsers();
    await seedEvents();
    await seedVouchers();
    console.log('Run seeders completed');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
})();
