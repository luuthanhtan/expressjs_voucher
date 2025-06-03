import { Router } from 'express';
import authRoutes from './auth.route';
import userRoutes from './user.route';
import eventRoutes from './event.route';
import voucherRoutes from './voucher.route';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/events', eventRoutes);
router.use('/vouchers', voucherRoutes);

export default router;
