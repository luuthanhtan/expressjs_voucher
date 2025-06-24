import { Router } from "express";
import { EventController } from "../controllers/event.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validateBody } from "middlewares/validate.middleware";
import { eventCreateSchema, eventUpdateSchema } from "validations/event.validation";

const router = Router();
const eventController = new EventController();

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Add new event
 *     tags: [Event]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - quantity
 *               - start
 *               - end
 *               - description
 *               - status
 *             properties:
 *               title:
 *                 type: string
 *               quantity:
 *                 type: number
 *               start:
 *                 type: string
 *                 format: date
 *                 example: "YYYY-MM-DD"
 *               end:
 *                 type: string
 *                 format: date
 *                 example: "YYYY-MM-DD"
 *               description:
 *                 type: string
 *               status:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 */
router.post("/", authMiddleware, validateBody(eventCreateSchema), eventController.create);
/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get list events
 *     tags:
 *       - Event
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Event get successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       404:
 *         description: Event not found
 */
/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get event
 *     tags:
 *       - Event
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         required: true
 *         in: path
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event get successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       404:
 *         description: Event not found
 */
router.get("/:id", authMiddleware, eventController.read);
/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Update event
 *     tags: [Event]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               start:
 *                 type: string
 *                 format: date
 *                 example: "YYYY-MM-DD"
 *               end:
 *                 type: string
 *                 format: date
 *                 example: "YYYY-MM-DD"
 *               description:
 *                 type: string
 *               status:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 */
router.put("/:id", authMiddleware, validateBody(eventUpdateSchema), eventController.update);
/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Delete event
 *     tags:
 *       - Event
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Event deleted successfully (no content)
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", authMiddleware, eventController.delete);
/**
 * @swagger
 * /events/{eventId}/editable/me:
 *   post:
 *     summary: Lock event for editing by current user
 *     tags: [Event]
 *     security:
 *       - BearerAuth: []
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
router.post(
  "/:eventId/editable/me",
  authMiddleware,
  eventController.acquireEdit
);
/**
 * @swagger
 * /events/{eventId}/editable/release:
 *   post:
 *     summary: Release edit lock for the current user
 *     tags: [Event]
 *     security:
 *       - BearerAuth: []
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
router.post(
  "/:eventId/editable/release",
  authMiddleware,
  eventController.releaseEdit
);
/**
 * @swagger
 * /events/{eventId}/editable/maintain:
 *   post:
 *     summary: Extend the edit lock for current user
 *     tags: [Event]
 *     security:
 *       - BearerAuth: []
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
router.post(
  "/:eventId/editable/maintain",
  authMiddleware,
  eventController.maintainEdit
);

export default router;
