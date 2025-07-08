import { AuthController } from '../../src/controllers/auth.controller';
import { AuthService } from '../../src/services/auth.service';

jest.mock('@src/services/auth.service');

const mockRes = () => {
  const json = jest.fn();
  const status = jest.fn(() => ({ json }));
  return { status, json };
};

describe('AuthController (with Jest)', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('register', () => {
    it('400 if AuthService returns an error string', async () => {
      const req = {
        body: { email: 'test_register@example.com', password: 'Seven007@@' },
      } as any;
      const res = mockRes();

      (AuthService.register as jest.Mock).mockResolvedValue('Email exists');

      await AuthController.register(req, res as any);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Email exists' });
    });

    it('201 if registration is successful', async () => {
      const user = { id: 1, email: 'test_register@example.com' };
      const req = {
        body: { ...user, password: 'Seven007@@' },
      } as any;
      const res = mockRes();

      (AuthService.register as jest.Mock).mockResolvedValue(user);

      await AuthController.register(req, res as any);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(user);
    });
  });

  describe('login', () => {
    it('400 if AuthService returns an error object', async () => {
      const req = {
        body: {
          email: 'test_login@example.com',
          password: 'Seven007@@',
        },
      } as any;
      const res = mockRes();

      (AuthService.login as jest.Mock).mockResolvedValue({
        error: 'Invalid credentials',
      });

      await AuthController.login(req, res as any);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });

    it('200 if login is successful', async () => {
      const req = {
        body: {
          email: 'test_login@example.com',
          password: 'Seven007@@',
        },
      } as any;
      const res = mockRes();

      (AuthService.login as jest.Mock).mockResolvedValue('mock-token');

      await AuthController.login(req, res as any);

      expect(res.json).toHaveBeenCalledWith({ token: 'mock-token' });
    });
  });
});
