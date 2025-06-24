import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { BaseController } from "./base.controller";

export class UserController extends BaseController {
  constructor() {
    super();
  }

  async getUser(req: Request, res: Response): Promise<void> {
    const userId = super.getUserId(req);
    const user = await UserService.getById(userId);
    if ("error" in user) {
      res.status(400).json({ message: user.error });
    }
    res.json(user);
  }

  async update(req: Request, res: Response): Promise<void> {
    const userId = super.getUserId(req);
    const user = await UserService.update(userId, req.body);
    if ("error" in user) {
      res.status(400).json({ message: user.error });
    }
    res.json(user);
  }

  async delete(req: Request, res: Response): Promise<void> {
    const userId = super.getUserId(req);
    const user = await UserService.delete(userId);
    res.json(user);
  }
}
