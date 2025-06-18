import { Request, Response } from "express";
import { VoucherService } from "../services/voucher.service";
import { BaseController } from "./base.controller";
import { pushEmailToQueue } from "queues/bullQueue";
import { UserService } from "services/user.service";

export class VoucherController extends BaseController {
  constructor() {
    super();
  }

  requestVoucher = async (req: Request, res: Response) => {
    try {
      const userId = this.getUserId(req);
      const data = {
        code: req.body.code,
        title: req.body.title,
        description: req.body.description,
        status: req.body.status || true,
        startDate: req.body.startDate,
        expireDate: req.body.expireDate,
        value: req.body.value || 0,
        percentage: req.body.percentage || 0,
        isPercent: req.body.isPercent || false,
        eventId: req.body.eventId,
        userId: userId,
      };
      const vouchers = await VoucherService.issueVoucher(
        data,
        req.body.quantity
      );
      if (vouchers) {
        const user = await UserService.getById(userId);
        if (!user || !user.email) throw new Error("User email not found");
        const codes = vouchers.map((voucher) => {
          if (!voucher.code) throw new Error("Voucher code not found");
          return `
              <h2>Your Voucher Details 🎟️</h2>
              <p><b>Code:</b> ${voucher.code}</p>
              <p><b>Title:</b> ${voucher.title}</p>
              <p><b>Description:</b> ${voucher.description || "-"}</p>
              <p><b>Status:</b> ${voucher.status ? "Active" : "Inactive"}</p>
              <p><b>Start Date:</b> ${new Date(
                voucher.startDate
              ).toLocaleString()}</p>
              <p><b>Expire Date:</b> ${new Date(
                voucher.expireDate
              ).toLocaleString()}</p>
              <p><b>Value:</b> ${
                voucher.isPercent
                  ? voucher.percentage + "%"
                  : "$" + voucher.value
              }</p>
            `;
        });
        const html = codes.join("<hr/>");
        pushEmailToQueue({
          to: String(user.email),
          subject: "Your Vouchers Code 🎟️",
          html: html,
        });
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
      res.json(voucher);
      return;
    }
    const vouchers = await VoucherService.getList();
    res.json(vouchers);
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const voucherId = req.params.voucherId;
    const voucher = await VoucherService.update(voucherId, req.body);
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
