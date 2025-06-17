import { Request, Response } from "express";
import { VoucherService } from "../services/voucher.service";
import { BaseController } from "./base.controller";
import { pushEmailToQueue } from "queues/bullQueue";
import { UserService } from "services/user.service";


export class VoucherController extends BaseController {
  requestVoucher = async (req: Request, res: Response) => {
    const { eventId } = req.body;
    try {
      const userId = this.getUserId(req);
      const voucher = await VoucherService.issueVoucher(eventId, userId);
      if (voucher) {
        const user = await UserService.getById(userId);
        if (!user || !user.email) throw new Error('User email not found');
        pushEmailToQueue({
          to: user.email,
          subject: 'Your Voucher Code 🎟️',
          html: `<p>Your voucher code is: <b>${voucher.code}</b></p>`,
        });
      }
      res.status(201).json(voucher);
    } catch (err: any) {
      if (err.code === "LIMIT_REACHED") {
        res.status(456).json({ message: "Limit reached" });
        return;
      }
      res.status(500).json({ error: err.message });
    }
  }
}
