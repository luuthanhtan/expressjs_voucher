import { Router } from 'express';
import { VoucherController } from '../controllers/voucher.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const voucherController = new VoucherController();

router.post('/request', authMiddleware, voucherController.requestVoucher);

export default router;