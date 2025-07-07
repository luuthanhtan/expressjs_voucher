import bcrypt from "bcrypt";
import { User, UserDocument } from "../models/user.model";

export class UserService {
  private static instance: UserService;

  private constructor() {}

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  static async create(data: {
    name?: string;
    email?: string;
    password?: string;
  }): Promise<UserDocument> {
    const { name, email, password } = data;
    const hashed = await bcrypt.hash(password || "", 10);
    const user = await User.create({ name, email, password: hashed });
    return user;
  }

  static async getById(userId: string): Promise<object> {
    const user = await User.findById(userId).select("-password").lean();
    if (!user) {
      return { error: "User not found" };
    }
    return user;
  }

  static async update(
    userId: string,
    data: { name?: string; email?: string; password?: string }
  ): Promise<object> {
    const hashed = await bcrypt.hash(data.password || "", 10);
    data.password = hashed;
    const updated = await User.findOneAndUpdate({ _id: userId }, data, {
      new: true,
    }).lean();
    if (!updated) {
      return { error: "User not updated" };
    }
    return updated;
  }

  static async delete(userId: String): Promise<boolean> {
    const result = await User.findByIdAndDelete(userId);
    return !!result;
  }
}
