import mongoose from "mongoose";
import { VoucherService } from "../../src/services/voucher.service";
import { Voucher } from "../../src/models/voucher.model";
import { Event } from "../../src/models/event.model";

jest.mock("../../src/models/voucher.model");
jest.mock("../../src/models/event.model");

const mockEventId = "64abc1234abc1234abc1234a";
const mockUserId = "64def5678def5678def5678d";
const baseVoucherData = {
  eventId: mockEventId,
  userId: mockUserId,
  title: "Test Voucher",
  description: "Voucher desc",
  startDate: new Date(),
  expireDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
  value: 10000,
  isPercent: false,
};

describe("VoucherService", () => {
  describe("issueVoucher", () => {
    let mockSession: any;

    beforeEach(() => {
      jest.clearAllMocks();
      mockSession = {
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        abortTransaction: jest.fn(),
        endSession: jest.fn(),
      };
      jest.spyOn(mongoose, "startSession").mockResolvedValue(mockSession);
    });

    it("should return error if event not found", async () => {
      (Event.findById as jest.Mock).mockReturnValue({
        session: jest.fn().mockResolvedValue(null),
      });

      const result = await VoucherService.issueVoucher(
        { ...baseVoucherData },
        2
      );

      expect(result).toBe("Event not found");
      expect(mockSession.abortTransaction).toHaveBeenCalled();
      expect(mockSession.endSession).toHaveBeenCalled();
    });

    it("should return error if not enough quantity", async () => {
      (Event.findById as jest.Mock).mockReturnValue({
        session: jest.fn().mockResolvedValue({
          quantity: 5,
          usedQuantity: 5,
        }),
      });

      const result = await VoucherService.issueVoucher(
        { ...baseVoucherData },
        1
      );

      expect(result).toBe("Event quantity not enough");
      expect(mockSession.abortTransaction).toHaveBeenCalled();
      expect(mockSession.endSession).toHaveBeenCalled();
    });

    it("should insert vouchers, update event and commit transaction", async () => {
      const eventMock = {
        quantity: 10,
        usedQuantity: 3,
        save: jest.fn().mockResolvedValue(true),
      };

      const mockInserted = [{ code: "VC1" }, { code: "VC2" }];
      (Event.findById as jest.Mock).mockReturnValue({
        session: jest.fn().mockResolvedValue(eventMock),
      });

      (Voucher.insertMany as jest.Mock).mockResolvedValue(mockInserted);

      const result = await VoucherService.issueVoucher(
        { ...baseVoucherData },
        2
      );

      expect(Voucher.insertMany).toHaveBeenCalledTimes(1);
      expect(eventMock.save).toHaveBeenCalled();
      expect(mockSession.commitTransaction).toHaveBeenCalled();
      expect(mockSession.endSession).toHaveBeenCalled();
      expect(result).toEqual(mockInserted);
    });

    it("should abort transaction on error", async () => {
      (Event.findById as jest.Mock).mockImplementation(() => {
        throw new Error("DB Error");
      });

      const result = await VoucherService.issueVoucher(
        { ...baseVoucherData },
        1
      );

      expect(result).toBe("Request vouchers error");
      expect(mockSession.abortTransaction).toHaveBeenCalled();
      expect(mockSession.endSession).toHaveBeenCalled();
    });
  });

  describe("getList", () => {
    it("should return voucher list", async () => {
      const mockVouchers = [{ code: "A" }, { code: "B" }];
      (Voucher.find as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockVouchers),
      });

      const result = await VoucherService.getList();
      expect(result).toEqual(mockVouchers);
    });

    it("should return error if no vouchers", async () => {
      (Voucher.find as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      const result = await VoucherService.getList();
      expect(result).toEqual({ error: "Vouchers not found" });
    });
  });

  describe("getById", () => {
    it("should return voucher by id", async () => {
      const mockVoucher = { code: "VC1" };
      (Voucher.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockVoucher),
      });

      const result = await VoucherService.getById("voucherId");
      expect(result).toEqual(mockVoucher);
    });

    it("should return error if voucher not found", async () => {
      (Voucher.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      const result = await VoucherService.getById("invalid");
      expect(result).toEqual({ error: "Voucher not found" });
    });
  });

  describe("update", () => {
    it("should update voucher", async () => {
      const updated = { code: "UpdatedVC" };
      (Voucher.findOneAndUpdate as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(updated),
      });

      const result = await VoucherService.update("id123", { title: "new" });
      expect(result).toEqual(updated);
    });

    it("should return error if not updated", async () => {
      (Voucher.findOneAndUpdate as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      const result = await VoucherService.update("id123", { title: "new" });
      expect(result).toEqual({ error: "Voucher not updated" });
    });
  });

  describe("delete", () => {
    it("should return true if deleted", async () => {
      (Voucher.findByIdAndDelete as jest.Mock).mockResolvedValue({ _id: "1" });

      const result = await VoucherService.delete("id");
      expect(result).toBe(true);
    });

    it("should return false if not found", async () => {
      (Voucher.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      const result = await VoucherService.delete("id");
      expect(result).toBe(false);
    });
  });
});
