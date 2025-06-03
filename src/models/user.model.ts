import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  { 
    name: { type: String, required: false },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    created: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
