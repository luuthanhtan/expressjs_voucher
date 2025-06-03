import mongoose from "mongoose";

const voucherSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Voucher = mongoose.model("Voucher", voucherSchema);
