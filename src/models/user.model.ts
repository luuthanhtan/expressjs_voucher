import { Schema, model, Document } from "mongoose";

export interface UserDocument extends Document {
  name?: String;
  email: String;
  password: String;
  created: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    created: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const User = model<UserDocument>("User", userSchema);
