import { Request, Response } from "express";
import { UserController } from "../../src/controllers/user.controller";
import { UserService } from "../../src/services/user.service";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

jest.mock("../../src/services/user.service");

const SECRET = "test_secret";

const createToken = (userId: string) => {
  return jwt.sign({ userId }, SECRET);
};

const mockReq = (userId: string, body: any = {}): Request => {
  const token = createToken(userId);
  return {
    headers: { authorization: `Bearer ${token}` },
    body,
    user: { id: userId },
  } as Request;
};

const mockRes = () => {
  const json = jest.fn();
  const status = jest.fn(() => ({ json }));
  return { status, json };
};

class TestableUserController extends UserController {
  protected getUserId(req: Request): any {
    return req.user?.id;
  }
}

describe("UserController", () => {
  let controller: TestableUserController;
  let objectId: ObjectId;

  beforeEach(() => {
    controller = new TestableUserController();
    objectId = new ObjectId();
    jest.clearAllMocks();
  });

  describe("getUser", () => {
    it("should return user if found", async () => {
      const user = { _id: objectId, email: "test@example.com" };
      (UserService.getById as jest.Mock).mockResolvedValue(user);

      const req = mockReq(objectId.toString());
      const res = mockRes();

      await controller.getUser(req, res as any);

      expect(res.json).toHaveBeenCalledWith(user);
    });

    it("should return 400 if user not found", async () => {
      (UserService.getById as jest.Mock).mockResolvedValue({
        error: "User not found",
      });

      const req = mockReq(objectId.toString());
      const res = mockRes();

      await controller.getUser(req, res as any);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });
  });

  describe("update", () => {
    it("should return updated user", async () => {
      const updated = { _id: objectId, name: "Updated" };
      (UserService.update as jest.Mock).mockResolvedValue(updated);

      const req = mockReq(objectId.toString(), { name: "Updated" });
      const res = mockRes();

      await controller.update(req, res as any);

      expect(res.json).toHaveBeenCalledWith(updated);
    });

    it("should return 400 if update fails", async () => {
      (UserService.update as jest.Mock).mockResolvedValue({
        error: "Invalid data",
      });

      const req = mockReq(objectId.toString(), { name: "" });
      const res = mockRes();

      await controller.update(req, res as any);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid data" });
    });
  });

  describe("delete", () => {
    it("should return result from delete", async () => {
      const result = { success: true };
      (UserService.delete as jest.Mock).mockResolvedValue(result);

      const req = mockReq(objectId.toString());
      const res = mockRes();

      await controller.delete(req, res as any);

      expect(res.json).toHaveBeenCalledWith(result);
    });
  });
});
