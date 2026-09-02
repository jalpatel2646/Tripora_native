import { Router } from 'express';
import activityRoutes from './activityRoutes';
import { createStop, getStops, updateStop, deleteStop } from '../controllers/stop.controller';

// merged param access from parent route e.g. /trips/:tripId/stops
const router = Router({ mergeParams: true });

router.use('/:stopId/activities', activityRoutes);

router.post('/', createStop);
router.get('/', getStops);
router.patch('/:stopId', updateStop);
router.delete('/:stopId', deleteStop);

export default router;
