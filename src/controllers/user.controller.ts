import e, { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { BaseController } from './base.controller';

export class UserController extends BaseController {
  async getUser(req: Request, res: Response) {
    const userId = this.getUserId(req);
    const user = await UserService.getById(userId);
    res.json(user);
  }
}