import { Event } from "../models/event.model";
import { Voucher, voucherDocument } from "../models/voucher.model";

export class VoucherService {
  static async issueVoucher(data: Record<string, any>, quantity: number): Promise<Array<voucherDocument>> {
    try {
      var vouchers: Array<voucherDocument> = [];
      for (let i = 0; i < quantity; i++) {
        const event = await Event.findById(data.eventId);
        if (!event || event.quantity <= 0) {
          break;
        }
        event.quantity -= 1;
        await event.save();

        const code = "VC" + Date.now();
        let createVoucher = {
            code: code,
            title: data.title,
            description: data.description,
            status: data.status || true,
            startDate: data.startDate,
            expireDate: data.expireDate,
            value: data.value || 0,
            percentage: data.percentage || 0,
            isPercent: data.isPercent || false,
            eventId: data.eventId,
            userId: data.userId,
        }
        const voucher = await this.create(createVoucher)
        vouchers.push(voucher);
      }
      return vouchers;
    } catch (err) {
      throw err;
    }
  }

  static async create(data: object): Promise<voucherDocument> {
    const voucher = await Voucher.create(data);
    return voucher;
  }
}
