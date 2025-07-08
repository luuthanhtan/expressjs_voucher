import { EventController } from "../../src/controllers/event.controller";
import { EventService } from "../../src/services/event.service";
import { ObjectId } from "mongodb";

jest.mock("../../src/services/event.service");

const mockRes = () => {
  const json = jest.fn();
  const status = jest.fn(() => ({ json }));
  const sendStatus = jest.fn();
  return { json, status, sendStatus };
};

const mockReq = (userId: string, options: any = {}) => ({
  user: { id: userId },
  body: {},
  params: {},
  ...options,
});

describe("EventController", () => {
  let controller: EventController;
  let userId: string;
  let eventId: string;

  beforeEach(() => {
    controller = new EventController();
    userId = new ObjectId().toString();
    eventId = new ObjectId().toString();
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should return 201 on success", async () => {
      (EventService.create as jest.Mock).mockResolvedValue({ id: "created" });

      const req = mockReq(userId, { body: { name: "New Event" } });
      const res = mockRes();

      await controller.create(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: "created" });
    });

    it("should return 400 on error", async () => {
      (EventService.create as jest.Mock).mockResolvedValue({ error: "fail" });

      const req = mockReq(userId, { body: {} });
      const res = mockRes();

      await controller.create(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "fail" });
    });
  });

  describe("read", () => {
    it("should return event by ID", async () => {
      (EventService.getById as jest.Mock).mockResolvedValue({ id: eventId });

      const req = mockReq(userId, { params: { eventId } });
      const res = mockRes();

      await controller.read(req as any, res as any);

      expect(res.json).toHaveBeenCalledWith({ id: eventId });
    });

    it("should return 400 if not found by ID", async () => {
      (EventService.getById as jest.Mock).mockResolvedValue({
        error: "not found",
      });

      const req = mockReq(userId, { params: { eventId } });
      const res = mockRes();

      await controller.read(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "not found" });
    });

    it("should return list of events", async () => {
      (EventService.getList as jest.Mock).mockResolvedValue([{ id: 1 }]);

      const req = mockReq(userId, { params: {} });
      const res = mockRes();

      await controller.read(req as any, res as any);

      expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
    });
  });

  describe("update", () => {
    it("should return updated event", async () => {
      (EventService.update as jest.Mock).mockResolvedValue({ name: "updated" });

      const req = mockReq(userId, {
        params: { eventId },
        body: { name: "updated" },
      });
      const res = mockRes();

      await controller.update(req as any, res as any);

      expect(res.json).toHaveBeenCalledWith({ name: "updated" });
    });

    it("should return 400 on update error", async () => {
      (EventService.update as jest.Mock).mockResolvedValue({
        error: "invalid",
      });

      const req = mockReq(userId, {
        params: { eventId },
        body: {},
      });
      const res = mockRes();

      await controller.update(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "invalid" });
    });
  });

  describe("delete", () => {
    it("should return 204 on success", async () => {
      (EventService.delete as jest.Mock).mockResolvedValue(true);

      const req = mockReq(userId, { params: { eventId } });
      const res = mockRes();

      await controller.delete(req as any, res as any);

      expect(res.sendStatus).toHaveBeenCalledWith(204);
    });

    it("should return 409 on failure", async () => {
      (EventService.delete as jest.Mock).mockResolvedValue(false);

      const req = mockReq(userId, { params: { eventId } });
      const res = mockRes();

      await controller.delete(req as any, res as any);

      expect(res.sendStatus).toHaveBeenCalledWith(409);
    });
  });

  describe("acquireEdit", () => {
    it("should return 200 if acquired", async () => {
      (EventService.acquire as jest.Mock).mockResolvedValue(true);

      const req = mockReq(userId, { params: { eventId } });
      const res = mockRes();

      await controller.acquireEdit(req as any, res as any);

      expect(res.sendStatus).toHaveBeenCalledWith(200);
    });

    it("should return 409 if not acquired", async () => {
      (EventService.acquire as jest.Mock).mockResolvedValue(false);

      const req = mockReq(userId, { params: { eventId } });
      const res = mockRes();

      await controller.acquireEdit(req as any, res as any);

      expect(res.sendStatus).toHaveBeenCalledWith(409);
    });
  });

  describe("releaseEdit", () => {
    it("should return status from service", async () => {
      (EventService.release as jest.Mock).mockResolvedValue({
        code: 200,
        message: "released",
      });

      const req = mockReq(userId, { params: { eventId } });
      const res = mockRes();

      await controller.releaseEdit(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "released" });
    });
  });

  describe("maintainEdit", () => {
    it("should return 200 if extended", async () => {
      (EventService.maintain as jest.Mock).mockResolvedValue(true);

      const req = mockReq(userId, { params: { eventId } });
      const res = mockRes();

      await controller.maintainEdit(req as any, res as any);

      expect(res.sendStatus).toHaveBeenCalledWith(200);
    });

    it("should return 409 if failed", async () => {
      (EventService.maintain as jest.Mock).mockResolvedValue(false);

      const req = mockReq(userId, { params: { eventId } });
      const res = mockRes();

      await controller.maintainEdit(req as any, res as any);

      expect(res.sendStatus).toHaveBeenCalledWith(409);
    });
  });
});
