import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { userUpdateSchema } from 'validations/user.validation';

const router = Router();
const userController = new UserController();

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current user
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 name:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */
router.get('/me', authMiddleware, userController.getUser);
/**
 * @swagger
 * /users/update:
 *   put:
 *     summary: Update user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
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
router.put('/update', authMiddleware, validateBody(userUpdateSchema), userController.update);
/**
 * @swagger
 * /users/delete:
 *   delete:
 *     summary: Delete user
 *     tags: [User]
 *     responses:
 *       204:
 *         description: User deleted successfully (no content)
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete("/delete", authMiddleware, userController.delete);

export default router;
