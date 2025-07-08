import { UserService } from "../../src/services/user.service";
import { User } from "../../src/models/user.model";
import bcrypt from "bcrypt";

// Mock modules
jest.mock("../../src/models/user.model");
jest.mock("bcrypt");

// Mock data
const mockUserId = "64abc1234abc1234abc1234a";
const mockUserInput = {
  name: "Test User",
  email: "test@example.com",
  password: "Seven007@@",
};
const mockHashedPassword = "hashed_password";
const mockUser = {
  _id: mockUserId,
  name: mockUserInput.name,
  email: mockUserInput.email,
};
const mockUserWithPassword = {
  ...mockUser,
  password: mockHashedPassword,
};

describe("UserService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should hash the password and create a user", async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword);
      (User.create as jest.Mock).mockResolvedValue(mockUserWithPassword);

      const result = await UserService.create(mockUserInput);

      expect(bcrypt.hash).toHaveBeenCalledWith(mockUserInput.password, 10);
      expect(User.create).toHaveBeenCalledWith({
        name: mockUserInput.name,
        email: mockUserInput.email,
        password: mockHashedPassword,
      });
      expect(result).toBe(mockUserWithPassword);
    });
  });

  describe("getById", () => {
    it("should return user without password if found", async () => {
      const mockLean = jest.fn().mockResolvedValue(mockUser);
      const mockSelect = jest.fn().mockReturnValue({ lean: mockLean });
      (User.findById as jest.Mock).mockReturnValue({ select: mockSelect });

      const result = await UserService.getById(mockUserId);
      expect(User.findById).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual(mockUser);
    });

    it("should return error if user not found", async () => {
      const mockLean = jest.fn().mockResolvedValue(null);
      const mockSelect = jest.fn().mockReturnValue({ lean: mockLean });
      (User.findById as jest.Mock).mockReturnValue({ select: mockSelect });

      const result = await UserService.getById("nonexistent_id");
      expect(result).toEqual({ error: "User not found" });
    });
  });

  describe("update", () => {
    it("should hash the new password and update user", async () => {
      const updatedUser = { ...mockUser, name: "Updated" };
      (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword);
      (User.findOneAndUpdate as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(updatedUser),
      });

      const result = await UserService.update(mockUserId, {
        name: "Updated",
        password: "newpass",
      });

      expect(bcrypt.hash).toHaveBeenCalledWith("newpass", 10);
      expect(User.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockUserId },
        { name: "Updated", password: mockHashedPassword },
        { new: true }
      );
      expect(result).toEqual(updatedUser);
    });

    it("should return error if user not updated", async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword);
      (User.findOneAndUpdate as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      const result = await UserService.update(mockUserId, {
        name: "Fail update",
        password: "failpass",
      });

      expect(result).toEqual({ error: "User not updated" });
    });
  });

  describe("delete", () => {
    it("should return true if deleted", async () => {
      (User.findByIdAndDelete as jest.Mock).mockResolvedValue(mockUser);

      const result = await UserService.delete(mockUserId);
      expect(User.findByIdAndDelete).toHaveBeenCalledWith(mockUserId);
      expect(result).toBe(true);
    });

    it("should return false if not found", async () => {
      (User.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      const result = await UserService.delete("invalid_id");
      expect(result).toBe(false);
    });
  });
});
