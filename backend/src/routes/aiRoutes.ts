import { Router } from 'express';
import { generatePlan } from '../controllers/ai.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.use(protect); // Require auth

router.post('/plan', generatePlan);

export default router;
