import mongoose, { Schema, model, Document } from "mongoose";

export interface voucherDocument extends Document {
  code: String;
  title: String;
  description?: String;
  status: Boolean;
  startDate: Date;
  expireDate: Date;
  value: Number;
  isPercent: Boolean;
  eventId: String;
  userId: String;
}

const voucherSchema = new Schema<voucherDocument>(
  {
    code: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String},
    status: { type: Boolean },
    startDate: { type: Date },
    expireDate: { type: Date, required: true },
    value: { type: Number, required: true },
    isPercent: { type: Boolean, required: true },
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

export const Voucher = model<voucherDocument>("Voucher", voucherSchema);
