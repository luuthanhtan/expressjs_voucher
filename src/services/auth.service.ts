import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { appConfig } from "../config/app";

export class AuthService {

  static async register(email: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed });
    return { id: user._id, email: user.email };
  }

  static async login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid credentials");
    return jwt.sign({ id: user._id }, appConfig.jwtSecret, {
      expiresIn: "1h",
    });
  }
}
