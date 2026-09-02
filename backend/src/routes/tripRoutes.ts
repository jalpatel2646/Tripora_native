import { Router } from 'express';
import { 
  createTrip, 
  getTrips, 
  getTrip, 
  updateTrip, 
  deleteTrip, 
  setTripCover,
  optimizeTrip,
  getTripInsights
} from '../controllers/trip.controller';
import { protect } from '../middleware/auth.middleware';

// External route routers nested
import stopRoutes from './stopRoutes';
import mediaRoutes from './mediaRoutes';
import expenseRoutes from './expenseRoutes';
import companionRoutes from './companionRoutes';

const router = Router();

router.use(protect); // ALL trip routes are protected

// Nested routing
router.use('/:tripId/stops', stopRoutes);
router.use('/:tripId/media', mediaRoutes);
router.use('/:tripId/expenses', expenseRoutes);
router.use('/:tripId/companions', companionRoutes);

router.route('/')
  .post(createTrip)
  .get(getTrips);

router.route('/:id')
  .get(getTrip)
  .patch(updateTrip)
  .delete(deleteTrip);

router.patch('/:id/cover', setTripCover);
router.patch('/:id/optimize', optimizeTrip);
router.get('/:id/insights', getTripInsights);

export default router;
