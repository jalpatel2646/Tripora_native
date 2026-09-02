import { Router } from 'express';
import { searchActivities } from '../controllers/activity.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();
router.use(protect);
router.get('/search', searchActivities);

export default router;
