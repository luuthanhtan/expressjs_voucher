import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { BaseController } from "./base.controller";

export class AuthController extends BaseController {
  static async register(req: Request, res: Response) {
    const user = await AuthService.register(req.body);
    if (typeof user === "string") {
      res.status(400).json({ message: user });
    }
    res.status(201).json(user);
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const token = await AuthService.login(email, password);
    if (typeof token === "object") {
      res.status(400).json({ message: token.error });
    }
    res.json({ token });
  }
}
