import e, { Request, Response } from 'express';
import { EventService } from '../services/event.service';
import { BaseController } from './base.controller';

export class EventController extends BaseController {
  private eventService: EventService;

  constructor() {
    super();
    this.eventService = new EventService();
  }
  create = async (req: Request, res: Response): Promise<void> => {
    const userId = this.getUserId(req);
    req.body.createdBy = userId;
    const event = await EventService.create(req.body);
    res.status(201).json(event);
  }

  read = async (req: Request, res: Response): Promise<void> => {
    console.log(req.params);
    const eventId = req.params.eventId;
    if (eventId) {
      const event = await EventService.getById(eventId);
      res.json(event);
      return;
    }
    const events = await EventService.getList();
    res.json(events);
  }

  update = async (req: Request, res: Response): Promise<void> => {
    const eventId = req.params.eventId;
    const event = await EventService.update(eventId, req.body);
    res.json(event);
  }

  delete = async (req: Request, res: Response): Promise<void> => {
    const eventId = req.params.eventId;
    const deleted = await EventService.delete(eventId);
    if (deleted) {
      res.sendStatus(204);
      return;
    }
    res.sendStatus(409);
  }

  acquireEdit = async (req: Request, res: Response): Promise<void> => {
    const eventId = req.params.eventId;
    const userId = this.getUserId(req);
    const acquired = await EventService.acquire(eventId, userId);
    if (acquired) {
      res.sendStatus(200);
      return;
    }
    res.sendStatus(409);
  }

  releaseEdit = async (req: Request, res: Response): Promise<void> => {
    const eventId = req.params.eventId;
    const userId = this.getUserId(req);
    await EventService.release(eventId, userId);
    res.sendStatus(200);
  }

  maintainEdit = async (req: Request, res: Response): Promise<void> => {
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
