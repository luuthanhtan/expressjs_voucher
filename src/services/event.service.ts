import { Event } from "../models/event.model";

export class EventService {
  static async acquire(eventId: string, userId: string) {
    const now = new Date();
    const result = await Event.findOneAndUpdate(
      {
        _id: eventId,
        $or: [
          { editingUser: null },
          { editingUserExpiresAt: { $lt: now } },
          { editingUser: userId },
        ],
      },
      {
        editingUser: userId,
        editingUserExpiresAt: new Date(now.getTime() + 5 * 60000),
      },
      { new: true }
    );
    return !!result;
  }

  static async release(eventId: string, userId: string) {
    await Event.updateOne(
      { _id: eventId, editingUser: userId },
      { editingUser: null, editingUserExpiresAt: null }
    );
  }

  static async maintain(eventId: string, userId: string) {
    const now = new Date();
    const result = await Event.findOneAndUpdate(
      {
        _id: eventId,
        editingUser: userId,
        editingUserExpiresAt: { $gt: now },
      },
      {
        editingUserExpiresAt: new Date(now.getTime() + 5 * 60000),
      },
      { new: true }
    );
    return !!result;
  }
}
