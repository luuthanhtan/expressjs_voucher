import { AuthService } from "../../src/services/auth.service";
import { UserService } from "../../src/services/user.service";
import { User } from "../../src/models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

jest.mock("../../src/services/user.service");
jest.mock("../../src/models/user.model");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

const userId = '648a81038480618444eb8ff1';
const email = "test@example.com";
const password = "Seven007@@";

describe("AuthService", () => {
  describe("register", () => {
    it("should create user and return id + email", async () => {
      const mockUser = { _id: userId, email: email };
      (UserService.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await AuthService.register({
        name: "Test",
        email: email,
        password: password,
      });

      expect(UserService.create).toHaveBeenCalledWith({
        name: "Test",
        email: email,
        password: password,
      });
      expect(result).toEqual({ id: userId, email: email });
    });

    it("should return error string if user not created", async () => {
      (UserService.create as jest.Mock).mockResolvedValue(null);

      const result = await AuthService.register({
        email: "fail@example.com",
        password: password,
      });

      expect(result).toBe("User not created");
    });
  });

  describe("login", () => {
    it("should return error if user not found", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      const result = await AuthService.login("notfound@example.com", "pass");

      expect(result).toEqual({ error: "Wrong email or password" });
    });

    it("should return error if password does not match", async () => {
      (User.findOne as jest.Mock).mockResolvedValue({
        _id: userId,
        password: "hashed",
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await AuthService.login(email, "wrong");

      expect(result).toEqual({ error: "Invalid credentials" });
    });

    it("should return JWT if login successful", async () => {
      (User.findOne as jest.Mock).mockResolvedValue({
        _id: userId,
        password: "hashed",
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("signed.jwt.token");

      const result = await AuthService.login(email, "correct");

      expect(result).toBe("signed.jwt.token");
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: userId },
        expect.any(String),
        {
          expiresIn: "8h",
        }
      );
    });
  });
});
