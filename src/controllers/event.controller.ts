import e, { Request, Response } from "express";
import { EventService } from "../services/event.service";
import { BaseController } from "./base.controller";

export class EventController extends BaseController {
  private eventService: EventService;

  constructor() {
    super();
    this.eventService = new EventService();
  }
  create = async (req: Request, res: Response): Promise<void> => {
    const userId = super.getUserId(req);
    req.body.createdBy = userId;
    req.body.usedQuantity = 0;
    const event = await EventService.create(req.body);
    if ("error" in event) {
      res.status(400).json({ message: event.error });
    }
    res.status(201).json(event);
  };

  read = async (req: Request, res: Response): Promise<void> => {
    const eventId = req.params.eventId;
    if (eventId) {
      const event = await EventService.getById(eventId);
      if ("error" in event) {
        res.status(400).json({ message: event.error });
      }
      res.json(event);
      return;
    }
    const events = await EventService.getList();
    if ("error" in events) {
      res.status(400).json({ message: events.error });
    }
    res.json(events);
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const userId = super.getUserId(req);
    const eventId = req.params.eventId;
    delete req.body.usedQuantity;
    delete req.body.quantity;
    const event = await EventService.update(eventId, userId, req.body);
    if ("error" in event) {
      res.status(400).json({ message: event.error });
    }
    res.json(event);
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const userId = super.getUserId(req);
    const eventId = req.params.eventId;
    const deleted = await EventService.delete(eventId, userId);
    if (deleted) {
      res.sendStatus(204);
      return;
    }
    res.sendStatus(409);
  };

  acquireEdit = async (req: Request, res: Response): Promise<void> => {
    const eventId = req.params.eventId;
    const userId = super.getUserId(req);
    const acquired = await EventService.acquire(eventId, userId);
    if (acquired) {
      res.sendStatus(200);
      return;
    }
    res.sendStatus(409);
  };

  releaseEdit = async (req: Request, res: Response): Promise<void> => {
    const eventId = req.params.eventId;
    const userId = super.getUserId(req);
    const release = await EventService.release(eventId, userId);
    res.status(release.code).json({ message: release.message });
  };

  maintainEdit = async (req: Request, res: Response): Promise<void> => {
    const eventId = req.params.eventId;
    const userId = super.getUserId(req);
    const extended = await EventService.maintain(eventId, userId);
    if (extended) {
      res.sendStatus(200);
      return;
    }
    res.sendStatus(409);
  };
}
