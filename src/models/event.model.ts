import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    editingUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    editingUserExpiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Event = mongoose.model("Event", eventSchema);
