import { VoucherController } from "../../src/controllers/voucher.controller";
import { VoucherService } from "../../src/services/voucher.service";
import { UserService } from "../../src/services/user.service";
import { pushEmailToQueue } from "../../src/queues/bullQueue";
import { renderTemplate } from "../../src/utils/renderTemplate";
import { Request, Response } from "express";

jest.mock("../../src/services/voucher.service");
jest.mock("../../src/services/user.service");
jest.mock("../../src/utils/renderTemplate");
jest.mock("../../src/queues/bullQueue", () => ({
  pushEmailToQueue: jest.fn(),
}))

const controller = new VoucherController();

describe("VoucherController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      params: {},
      body: {
        code: "CODE123",
        title: "Test title",
        description: "desc",
        startDate: new Date(),
        expireDate: new Date(),
        value: 10,
        isPercent: false,
        eventId: "event123",
        quantity: 1,
      },
      user: { id: "user123" },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      sendStatus: jest.fn(),
    } as any;

    jest.clearAllMocks();
  });

  describe("requestVoucher", () => {
    it("returns 456 if issueVoucher returns error string", async () => {
      (UserService.getById as jest.Mock).mockResolvedValue({
        email: "test@example.com",
      });
      (VoucherService.issueVoucher as jest.Mock).mockResolvedValue(
        "Some error"
      );

      await controller.requestVoucher(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(456);
      expect(res.json).toHaveBeenCalledWith({ message: "Some error" });
    });

    it("sends email and returns vouchers if success", async () => {
      const vouchers = [{ code: "A" }, { code: "B" }];
      (UserService.getById as jest.Mock).mockResolvedValue({
        email: "test@example.com",
      });
      (VoucherService.issueVoucher as jest.Mock).mockResolvedValue(vouchers);
      (renderTemplate as jest.Mock).mockImplementation(
        (v) => `<div>${v.code}</div>`
      );

      await controller.requestVoucher(req as Request, res as Response);

      expect(pushEmailToQueue).toHaveBeenCalledWith({
        to: "test@example.com",
        subject: "Your Vouchers Code 🎟️",
        html: "<div>A</div><hr/><div>B</div>",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(vouchers);
    });

    it("returns 456 if user has error", async () => {
      (UserService.getById as jest.Mock).mockResolvedValue({
        error: "User not found",
      });

      await controller.requestVoucher(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(456);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("returns 456 on LIMIT_REACHED error", async () => {
      (UserService.getById as jest.Mock).mockResolvedValue({
        email: "test@example.com",
      });
      (VoucherService.issueVoucher as jest.Mock).mockRejectedValue({
        code: "LIMIT_REACHED",
      });

      await controller.requestVoucher(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(456);
      expect(res.json).toHaveBeenCalledWith({ message: "Limit reached" });
    });

    it("returns 500 on unknown error", async () => {
      (UserService.getById as jest.Mock).mockResolvedValue({
        email: "test@example.com",
      });
      (VoucherService.issueVoucher as jest.Mock).mockRejectedValue(
        new Error("Boom")
      );

      await controller.requestVoucher(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Boom" });
    });
  });

  describe("read", () => {
    it("returns single voucher by id", async () => {
      req.params = { voucherId: "voucher123" };
      (VoucherService.getById as jest.Mock).mockResolvedValue({
        id: "voucher123",
        code: "ABC",
      });

      await controller.read(req as Request, res as Response);
      expect(res.json).toHaveBeenCalledWith({ id: "voucher123", code: "ABC" });
    });

    it("returns error when voucher not found", async () => {
      req.params = { voucherId: "voucher123" };
      (VoucherService.getById as jest.Mock).mockResolvedValue({
        error: "Not found",
      });

      await controller.read(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Not found" });
    });

    it("returns all vouchers if no id", async () => {
      req.params = {};
      (VoucherService.getList as jest.Mock).mockResolvedValue([
        { id: "1" },
        { id: "2" },
      ]);

      await controller.read(req as Request, res as Response);
      expect(res.json).toHaveBeenCalledWith([{ id: "1" }, { id: "2" }]);
    });

    it("returns error when getting all vouchers fails", async () => {
      req.params = {};
      (VoucherService.getList as jest.Mock).mockResolvedValue({
        error: "Query failed",
      });

      await controller.read(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Query failed" });
    });
  });

  describe("update", () => {
    it("updates voucher and returns it", async () => {
      req.params = { voucherId: "voucher1" };
      req.body = { title: "Updated" };
      (VoucherService.update as jest.Mock).mockResolvedValue({
        id: "voucher1",
        title: "Updated",
      });

      await controller.update(req as Request, res as Response);
      expect(res.json).toHaveBeenCalledWith({
        id: "voucher1",
        title: "Updated",
      });
    });

    it("returns error if update fails", async () => {
      req.params = { voucherId: "voucher1" };
      (VoucherService.update as jest.Mock).mockResolvedValue({
        error: "Update failed",
      });

      await controller.update(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Update failed" });
    });
  });

  describe("delete", () => {
    it("deletes voucher and returns 204", async () => {
      req.params = { eventId: "voucher123" };
      (VoucherService.delete as jest.Mock).mockResolvedValue(true);

      await controller.delete(req as Request, res as Response);
      expect(res.sendStatus).toHaveBeenCalledWith(204);
    });

    it("returns 409 if delete fails", async () => {
      req.params = { eventId: "voucher123" };
      (VoucherService.delete as jest.Mock).mockResolvedValue(false);

      await controller.delete(req as Request, res as Response);
      expect(res.sendStatus).toHaveBeenCalledWith(409);
    });
  });
});
