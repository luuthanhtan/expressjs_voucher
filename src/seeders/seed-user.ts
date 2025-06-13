import mongoose from 'mongoose';
import { User } from '../models/user.model';
import { appConfig } from 'config/app';


const MONGODB_URI = appConfig.mongoUri;

export const seedUsers = async () => {
  await mongoose.connect(MONGODB_URI);
  await User.deleteMany();

  await User.insertMany([
    { name: 'Admin', email: 'admin', password: '123456' },
    { name: 'Test', email: 'test@example.com', password: '123456' },
  ]);

  console.log('✅ Users seeded');
  await mongoose.disconnect();
};

seedUsers().catch((err) => {
  console.error('❌ Seeder error:', err);
  process.exit(1);
});
