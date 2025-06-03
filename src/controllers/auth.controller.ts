import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { BaseController } from "./base.controller";

export class AuthController extends BaseController {
  static async register(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await AuthService.register(email, password);
    res.status(201).json(user);
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const token = await AuthService.login(email, password);
    res.json({ token });
  }
}
