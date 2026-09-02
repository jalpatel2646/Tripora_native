import { Router } from 'express';
import { getRecommendations, updatePreferences } from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.use(protect); // Require auth

router.get('/recommendations', getRecommendations);
router.put('/preferences', updatePreferences);

export default router;
