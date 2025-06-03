import mongoose from "mongoose";
import { Event } from "../models/event.model";
import { Voucher } from "../models/voucher.model";
// import { enqueueVoucherEmail } from "../queues/email.queue";

export class VoucherService {
  static async issueVoucher(eventId: string, userId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const event = await Event.findById(eventId).session(session);
      if (!event || event.quantity <= 0) throw { code: "NOT AVAILABLE QUANTITY" };

      event.quantity -= 1;
      await event.save({ session });

      const code = "VC" + Date.now();
      const voucher = await Voucher.create([{ code, eventId, userId }], {
        session,
      });

      await session.commitTransaction();
      // enqueueVoucherEmail(userId, code);
      return voucher[0];
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }
}
