import { Event as EventModel } from './../models/event.model';
import mongoose from 'mongoose';
import { appConfig } from 'config/app';
import { Voucher } from '../models/voucher.model';
import { User } from 'models/user.model';


const MONGODB_URI = appConfig.mongoUri;

export const seedVouchers = async () => {
  await mongoose.connect(MONGODB_URI);

  const event = await EventModel.findOne();
  const user = await User.findOne();
  if (!event) {
    console.log('No event found to attach vouchers');
    return;
  }
  if (!user) {
    console.log('No user found to attach vouchers');
    return;
  }

  await Voucher.deleteMany();

  await Voucher.insertMany([
    {
      code: 'VOUCHER1',
      eventId: event._id,
      userId: user._id
    },
    {
      code: 'VOUCHER2',
      eventId: event._id,
      userId: user._id

    },
  ]);

  console.log('Vouchers seeded');
  await mongoose.disconnect();
};

seedVouchers().catch((err) => {
  console.error('Seeder vouchers error:', err);
  process.exit(1);
});