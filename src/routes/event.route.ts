import { Router } from 'express';
import { EventController } from '../controllers/event.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const eventController = new EventController();

router.post('/:eventId/editable/me', authMiddleware, eventController.acquireEdit);
router.post('/:eventId/editable/release', authMiddleware, eventController.releaseEdit);
router.post('/:eventId/editable/maintain', authMiddleware, eventController.maintainEdit);

export default router;
