import { Router } from 'express';
import { getAdminMetrics } from '../controllers/admin.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = Router();

router.use(protect);
router.use(restrictTo('ADMIN'));

router.get('/metrics', getAdminMetrics);

export default router;
