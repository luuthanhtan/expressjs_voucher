import { Event } from "./../models/event.model";

export class EventService {
  static async create(dataEvent: object): Promise<object> {
    const event = await Event.create(dataEvent);
    if (!event) throw new Error("Event not created");
    return event;
  }

  static async getList(): Promise<object> {
    const event = await Event.find()
      .select(["-editingUser", "-editingUserExpiresAt"])
      .lean();
    if (!event) throw new Error("Events not found");
    return event;
  }

  static async getById(eventId: string): Promise<object> {
    const event = await Event.findById(eventId)
      .select(["-editingUser", "-editingUserExpiresAt"])
      .lean();
    if (!event) throw new Error("Event not found");
    return event;
  }

  static async update(eventId: string, userId: string, dataEvent: object): Promise<object> {
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: eventId, editingUser: userId },
      dataEvent,
      { new: true }
    ).lean();
    if (!updatedEvent) throw new Error("Event not updated");
    return updatedEvent;
  }

  static async delete(eventId: string, userId: string): Promise<boolean> {
    const result = await Event.findOneAndDelete({ _id: eventId, editingUser: userId });
    return !!result
  }

  static async acquire(eventId: string, userId: string): Promise<boolean> {
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

  static async release(eventId: string, userId: string): Promise<void> {
    await Event.updateOne(
      { _id: eventId, editingUser: userId },
      { editingUser: null, editingUserExpiresAt: null }
    );
  }

  static async maintain(eventId: string, userId: string): Promise<boolean> {
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
