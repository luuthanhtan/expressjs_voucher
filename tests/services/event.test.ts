import { EventService } from "../../src/services/event.service";
import { Event } from "../../src/models/event.model";

jest.mock("../../src/models/event.model");

const eventId = "648a81038480618444eb8ff1";
const userId = "648a81038480618444eb8ff2";

describe("EventService", () => {
  const mockEvent = { _id: eventId, name: "Event 1" };
  const mockUpdated = { _id: eventId, name: "Updated" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create event and return it", async () => {
      (Event.create as jest.Mock).mockResolvedValue(mockEvent);
      const result = await EventService.create(mockEvent);
      expect(result).toEqual(mockEvent);
    });

    it("should return error if create fails", async () => {
      (Event.create as jest.Mock).mockResolvedValue(null);
      const result = await EventService.create(mockEvent);
      expect(result).toEqual({ error: "Event not created" });
    });
  });

  describe("getList", () => {
    it("should return list of events", async () => {
      (Event.find as any).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([mockEvent]),
      });

      const result = await EventService.getList();
      expect(result).toEqual([mockEvent]);
    });

    it("should return error if events not found", async () => {
      (Event.find as any).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(null),
      });

      const result = await EventService.getList();
      expect(result).toEqual({ error: "Events not found" });
    });
  });

  describe("getById", () => {
    it("should return event by id", async () => {
      (Event.findById as any).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockEvent),
      });

      const result = await EventService.getById(eventId);
      expect(result).toEqual(mockEvent);
    });

    it("should return error if event not found", async () => {
      (Event.findById as any).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(null),
      });

      const result = await EventService.getById(eventId);
      expect(result).toEqual({ error: "Event not found" });
    });
  });

  describe("update", () => {
    it("should update and return updated event", async () => {
      (Event.findOneAndUpdate as any).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockUpdated),
      });

      const result = await EventService.update(eventId, userId, {
        name: "Updated",
      });
      expect(result).toEqual(mockUpdated);
    });

    it("should return error if update fails", async () => {
      (Event.findOneAndUpdate as any).mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      const result = await EventService.update(eventId, userId, {
        name: "Updated",
      });
      expect(result).toEqual({ error: "Event not updated" });
    });
  });

  describe("delete", () => {
    it("should delete event and return true", async () => {
      (Event.findOneAndDelete as jest.Mock).mockResolvedValue(mockEvent);
      const result = await EventService.delete(eventId, userId);
      expect(result).toBe(true);
    });

    it("should return false if delete fails", async () => {
      (Event.findOneAndDelete as jest.Mock).mockResolvedValue(null);
      const result = await EventService.delete(eventId, userId);
      expect(result).toBe(false);
    });
  });

  describe("acquire", () => {
    it("should acquire lock and return true", async () => {
      (Event.findOneAndUpdate as jest.Mock).mockResolvedValue(mockEvent);
      const result = await EventService.acquire(eventId, userId);
      expect(result).toBe(true);
    });

    it("should return false if lock cannot be acquired", async () => {
      (Event.findOneAndUpdate as jest.Mock).mockResolvedValue(null);
      const result = await EventService.acquire(eventId, userId);
      expect(result).toBe(false);
    });
  });

  describe("release", () => {
    it("should release lock and return 200", async () => {
      jest.spyOn(EventService, "acquire").mockResolvedValue(true);
      (Event.updateOne as jest.Mock).mockResolvedValue({});

      const result = await EventService.release(eventId, userId);
      expect(result).toEqual({ code: 200, message: "Lock released" });
    });

    it("should return 409 if event not locked by user", async () => {
      jest.spyOn(EventService, "acquire").mockResolvedValue(false);

      const result = await EventService.release(eventId, userId);
      expect(result).toEqual({
        code: 409,
        message: "Event is not editable by the current user",
      });
    });
  });

  describe("maintain", () => {
    it("should extend lock and return true", async () => {
      (Event.findOneAndUpdate as jest.Mock).mockResolvedValue(mockEvent);
      const result = await EventService.maintain(eventId, userId);
      expect(result).toBe(true);
    });

    it("should return false if lock not extended", async () => {
      (Event.findOneAndUpdate as jest.Mock).mockResolvedValue(null);
      const result = await EventService.maintain(eventId, userId);
      expect(result).toBe(false);
    });
  });
});
