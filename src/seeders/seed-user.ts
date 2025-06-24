import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { User } from '../models/user.model';
import { appConfig } from 'config/app';
import logger from 'jet-logger';

const MONGODB_URI = appConfig.mongoUri;

export const seedUsers = async () => {
  await mongoose.connect(MONGODB_URI);
  await User.deleteMany();

  await User.insertMany([
    {
      name: 'Admin',
      email: 'admin',
      password: await bcrypt.hash('123456', 10)
    },
    {
      name: 'Test',
      email: 'test@example.com',
      password: await bcrypt.hash('123456', 10)
    },
  ]);

  logger.info('✅ Users seeded');
  await mongoose.disconnect();
};

seedUsers().catch((err) => {
  logger.err('❌ Seeder error:', err);
  process.exit(1);
});
