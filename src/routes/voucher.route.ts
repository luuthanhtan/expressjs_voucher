import { Router } from "express";
import { VoucherController } from "../controllers/voucher.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validateBody } from "middlewares/validate.middleware";
import { voucherCreateSchema, voucherUpdateSchema } from "validations/voucher.validation";

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
 *               - status
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
 *               isPercent:
 *                 type: boolean
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
router.post("/request", authMiddleware, validateBody(voucherCreateSchema), voucherController.requestVoucher);
/**
 * @swagger
 * /vouchers:
 *   get:
 *     summary: Get list vouchers
 *     tags:
 *       - Voucher
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Vouchers get successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       404:
 *         description: Vouchers not found
 */
/**
 * @swagger
 * /vouchers/{id}:
 *   get:
 *     summary: Get voucher
 *     tags:
 *       - Voucher
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
 *         description: Voucher get successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       404:
 *         description: Voucher not found
 */
router.get("/:id", authMiddleware, voucherController.read);
/**
 * @swagger
 * /vouchers/{id}:
 *   put:
 *     summary: Update voucher
 *     tags: [Voucher]
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
 *               isPercent:
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
router.put("/:id", authMiddleware, validateBody(voucherUpdateSchema), voucherController.update);
/**
 * @swagger
 * /vouchers/{id}:
 *   delete:
 *     summary: Delete voucher
 *     tags:
 *       - Voucher
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
 *         description: Voucher deleted successfully (no content)
 *       404:
 *         description: Voucher not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", authMiddleware, voucherController.delete);

export default router;
