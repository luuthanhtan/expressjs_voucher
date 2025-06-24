import { Request, Response } from "express";
import { VoucherService } from "../services/voucher.service";
import { BaseController } from "./base.controller";
import { pushEmailToQueue } from "queues/bullQueue";
import { UserService } from "services/user.service";
import { renderTemplate } from "utils/renderTemplate";

export class VoucherController extends BaseController {
  constructor() {
    super();
  }

  requestVoucher = async (req: Request, res: Response) => {
    try {
      const userId = super.getUserId(req);
      const user = await UserService.getById(userId);
      const data = {
        code: req.body.code,
        title: req.body.title,
        description: req.body.description,
        status: req.body.status || true,
        startDate: req.body.startDate,
        expireDate: req.body.expireDate,
        value: req.body.value || 0,
        isPercent: req.body.isPercent || false,
        eventId: req.body.eventId,
        userId: userId,
      };
      const vouchers = await VoucherService.issueVoucher(
        data,
        req.body.quantity
      );
      if (typeof vouchers === "string") {
        res.status(456).json({ message: vouchers });
      }
      if ("email" in user) {
          if (Array.isArray(vouchers)) {
            const html = vouchers
              .map((voucher) => renderTemplate(voucher))
              .join("<hr/>");
            pushEmailToQueue({
              to: String(user.email),
              subject: "Your Vouchers Code 🎟️",
              html: html,
            });
          }
      }
      if ("error" in user) {
        res.status(456).json({ message: user.error });
      }
      res.status(201).json(vouchers);
    } catch (err: any) {
      if (err.code === "LIMIT_REACHED") {
        res.status(456).json({ message: "Limit reached" });
        return;
      }
      res.status(500).json({ error: err.message });
    }
  };

  read = async (req: Request, res: Response): Promise<void> => {
    const voucherId = req.params.voucherId;
    if (voucherId) {
      const voucher = await VoucherService.getById(voucherId);
      if ("error" in voucher) {
        res.status(400).json({ message: voucher.error });
      }
      res.json(voucher);
      return;
    }
    const vouchers = await VoucherService.getList();
    if ("error" in vouchers) {
      res.status(400).json({ message: vouchers.error });
    }
    res.json(vouchers);
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const voucherId = req.params.voucherId;
    delete req.body.eventId;
    delete req.body.quantity;
    const voucher = await VoucherService.update(voucherId, req.body);
    if ("error" in voucher) {
      res.status(400).json({ message: voucher.error });
    }
    res.json(voucher);
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const voucherId = req.params.eventId;
    const deleted = await VoucherService.delete(voucherId);
    if (deleted) {
      res.sendStatus(204);
      return;
    }
    res.sendStatus(409);
  };
}
