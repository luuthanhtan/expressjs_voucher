import { Router } from 'express';
import { EventController } from '../controllers/event.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const eventController = new EventController();

/**
 * @swagger
 * /events/{eventId}/editable/me:
 *   post:
 *     summary: Lock event for editing by current user
 *     tags: [Event]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         schema:
 *           type: string
 *         required: true
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Editing lock acquired
 *       409:
 *         description: Someone else is editing this event
 */
router.post('/:eventId/editable/me', authMiddleware, eventController.acquireEdit);
/**
 * @swagger
 * /events/{eventId}/editable/release:
 *   post:
 *     summary: Release edit lock for the current user
 *     tags: [Event]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         schema:
 *           type: string
 *         required: true
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Lock released
 */
router.post('/:eventId/editable/release', authMiddleware, eventController.releaseEdit);
/**
 * @swagger
 * /events/{eventId}/editable/maintain:
 *   post:
 *     summary: Extend the edit lock for current user
 *     tags: [Event]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         schema:
 *           type: string
 *         required: true
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Lock extended
 */
router.post('/:eventId/editable/maintain', authMiddleware, eventController.maintainEdit);

export default router;
