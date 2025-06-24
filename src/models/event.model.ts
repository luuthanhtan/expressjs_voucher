import mongoose, { Types } from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    usedQuantity: { type: Number, required: true },
    quantity: { type: Number, required: true },
    description: { type: String },
    status: { type: String },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    editingUser: { type: Types.ObjectId, ref: "User", default: null },
    editingUserExpiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Event = mongoose.model("Event", eventSchema);
