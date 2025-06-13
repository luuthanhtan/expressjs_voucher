import { Event as EventModel } from './../models/event.model';
import mongoose from 'mongoose';
import { appConfig } from 'config/app'; 


const MONGODB_URI = appConfig.mongoUri;

export const seedEvents = async () => {
  await mongoose.connect(MONGODB_URI);
  await EventModel.deleteMany();

  await EventModel.insertMany([
    {
      name: 'Summer Event',
      quantity: 5,
    },
    {
      name: 'Winter Event',
      quantity: 10,
    },
  ]);

  console.log('Events seeded');
  await mongoose.disconnect();
};

seedEvents().catch((err) => {
  console.error('Seeder events error:', err);
  process.exit(1);
});