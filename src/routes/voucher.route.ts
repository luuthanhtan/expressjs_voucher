import { Router } from "express";
import { VoucherController } from "../controllers/voucher.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const voucherController = new VoucherController();

/**
 * @swagger
 * /vouchers/request:
 *   post:
 *     summary: Request vouchers code for an event
 *     tags: [Voucher]
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
 *               - startDate
 *               - expireDate
 *               - eventId
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: boolean
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "YYYY-MM-DD"
 *               expireDate:
 *                 type: string
 *                 format: date
 *                 example: "YYYY-MM-DD"
 *               value:
 *                 type: number
 *               percentage:
 *                 type: number
 *               isPercent:
 *                 type: number
 *               eventId:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Voucher issued
 *       456:
 *         description: No more vouchers left
 */
router.post("/request", authMiddleware, voucherController.requestVoucher);

export default router;
