import mongoose from "mongoose";
import { Event } from "../models/event.model";
import { Voucher, voucherDocument } from "../models/voucher.model";

export class VoucherService {
  static async issueVoucher(
    data: Record<string, any>,
    quantity: number
  ): Promise<Array<voucherDocument> | string> {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const event = await Event.findById(data.eventId).session(session);
      if (!event) {
        return "Event not found";
      }
      const availableQuantity = event.quantity - event.usedQuantity;
      if (availableQuantity < quantity) {
        return "Not enough vouchers available";
      }
      const now = Date.now();
      const vouchers = Array.from({ length: quantity }, (_, i) => ({
        code: `VC${now}${i}`,
        title: data.title,
        description: data.description,
        status: data.status ?? true,
        startDate: data.startDate,
        expireDate: data.expireDate,
        value: data.value ?? 0,
        percentage: data.percentage ?? 0,
        isPercent: data.isPercent ?? false,
        eventId: data.eventId,
        userId: data.userId,
      }));
      const createdVouchers = await Voucher.insertMany(vouchers, {
        session,
        ordered: true,
      });
      event.usedQuantity += quantity;
      await event.save({ session });
      await session.commitTransaction();
      session.endSession();
      return createdVouchers;
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.error(err);
      return "Request vouchers error";
    }
  }

  static async getList(): Promise<object> {
    const vouchers = await Voucher.find().lean();
    if (!vouchers) {
      return { error: "Vouchers not found" };
    }
    return vouchers;
  }

  static async getById(voucherId: string): Promise<object> {
    const voucher = await Voucher.findById(voucherId).lean();
    if (!voucher) {
      return { error: "Voucher not found" };
    }
    return voucher;
  }

  static async update(voucherId: string, data: object): Promise<object> {
    const voucher = await Voucher.findOneAndUpdate({ _id: voucherId }, data, {
      new: true,
    }).lean();
    if (!voucher) {
      return { error: "Voucher not updated" };
    }
    return voucher;
  }

  static async delete(voucherId: String): Promise<boolean> {
    const result = await Voucher.findByIdAndDelete(voucherId);
    return !!result;
  }
}
