import { Event as EventModel } from './../models/event.model';
import mongoose from 'mongoose';
import { appConfig } from 'config/app'; 
import logger from 'jet-logger';

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

  logger.info('Events seeded');
  await mongoose.disconnect();
};

seedEvents().catch((err) => {
  logger.err('Seeder events error:', err);
  process.exit(1);
});