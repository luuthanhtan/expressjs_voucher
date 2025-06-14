import e, { Request, Response } from 'express';
import { EventService } from '../services/event.service';
import { BaseController } from './base.controller';

export class EventController extends BaseController {

  create = async (req: Request, res: Response) => {
    const { name, quantity } = req.body;
    const event = await EventService.addNew(name, quantity);
    res.status(201).json(event);
  }

  acquireEdit = async (req: Request, res: Response) => {
    const eventId = req.params.eventId;
    const userId = this.getUserId(req);
    const acquired = await EventService.acquire(eventId, userId);
    if (acquired) {
      res.sendStatus(200);
      return;
    }
    res.sendStatus(409);
  }

  releaseEdit = async (req: Request, res: Response) => {
    const eventId = req.params.eventId;
    const userId = this.getUserId(req);
    await EventService.release(eventId, userId);
    res.sendStatus(200);
  }

  maintainEdit = async (req: Request, res: Response) => {
    const eventId = req.params.eventId;
    const userId = this.getUserId(req);
    const extended = await EventService.maintain(eventId, userId);
    if (extended) {
      res.sendStatus(200);
      return;
    }
    res.sendStatus(409);
  }
}
