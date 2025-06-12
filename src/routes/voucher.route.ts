import { Router } from 'express';
import { VoucherController } from '../controllers/voucher.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const voucherController = new VoucherController();

/**
 * @swagger
 * /vouchers:
 *   post:
 *     summary: Request a voucher code for an event
 *     tags: [Voucher]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Voucher issued
 *       456:
 *         description: No more vouchers left
 */
router.post('/request', authMiddleware, voucherController.requestVoucher);

export default router;