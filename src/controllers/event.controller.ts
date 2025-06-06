import e, { Request, Response } from 'express';
import { EventService } from '../services/event.service';
import { BaseController } from './base.controller';

export class EventController extends BaseController {
  async acquireEdit(req: Request, res: Response) {
    const eventId = req.params.eventId;
    const userId = this.getUserId(req);
    const acquired = await EventService.acquire(eventId, userId);
    if (acquired) {
      res.sendStatus(200);
    }
    res.sendStatus(409);
  }

  async releaseEdit(req: Request, res: Response) {
    const eventId = req.params.eventId;
    const userId = this.getUserId(req);
    await EventService.release(eventId, userId);
    res.sendStatus(200);
  }

  async maintainEdit(req: Request, res: Response) {
    const eventId = req.params.eventId;
    const userId = this.getUserId(req);
    const extended = await EventService.maintain(eventId, userId);
    if (extended) {
      res.sendStatus(200);
    }
    res.sendStatus(409);
  }
}
