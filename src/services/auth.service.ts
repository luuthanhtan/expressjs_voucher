import { UserService } from "services/user.service";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { appConfig } from "../config/app";

export class AuthService {
  private static instance: AuthService;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  static async register(data: {
    name?: string;
    email?: string;
    password?: string;
  }) {
    const user = await UserService.create(data);
    if (!user) return "User not created";
    return { id: user._id, email: user.email };
  }

  static async login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) return { error: "User not created" };
    const match = await bcrypt.compare(password, String(user.password));
    if (!match) return { error: "Invalid credentials" };
    return jwt.sign({ id: user._id }, appConfig.jwtSecret, {
      expiresIn: "8h",
    });
  }
}
