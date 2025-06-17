import bcrypt from 'bcrypt';
import Joi from "joi";
import { User, UserDocument } from "../models/user.model";

export class UserService {
  private static instance: UserService;
  public userSchema: Joi.ObjectSchema;

  private constructor() {
    const passwordSchema = Joi.string()
      .min(8)
      .pattern(
        new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-={}\\[\\]:;\"'<>,.?/]).+$"
        )
      )
      .message(
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character"
      );
    this.userSchema = Joi.object({
      email: Joi.string().email().required(),
      password: passwordSchema.required(),
    });
  }

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  static async create(data: { name?: string; email?: string, password?: string }): Promise<UserDocument> {
    const { error, value } = this.getInstance().userSchema.validate(data);
    if (error) throw new Error("Invalid email or password");
    const { name, email, password } = value;
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    return user;
  }

  static async getById(userId: string): Promise<UserDocument> {
    const user = await User.findById(userId).select("-password").lean();
    if (!user) throw new Error("User not found");
    return user;
  }

  static async update(userId: string, data: { name?: string; email?: string, password?: string }): Promise<object> {
    const { error, value } = this.getInstance().userSchema.validate(data);
    if (error) throw new Error("Invalid email or password");
    const updated = await User.findOneAndUpdate({ _id: userId }, value, {
      new: true,
    }).lean();
    if (!updated) throw new Error("User not updated");
    return updated;
  }

  static async delete(userId: String): Promise<boolean> {
    const result = await User.findByIdAndDelete(userId);
    return !!result
  }
}
