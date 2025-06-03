import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const userController = new UserController();

router.get('/me', authMiddleware, userController.getUser);

export default router;