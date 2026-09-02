import { Router } from 'express';
import { searchCities } from '../controllers/city.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.use(protect);
router.get('/search', searchCities);

export default router;
