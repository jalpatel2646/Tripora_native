import { Router } from 'express';
import mediaRoutes from './mediaRoutes';
import { createActivity, getActivities, updateActivity, deleteActivity } from '../controllers/activity.controller';

const router = Router({ mergeParams: true });

router.use('/:activityId/media', mediaRoutes);

router.post('/', createActivity);
router.get('/', getActivities);
router.patch('/:activityId', updateActivity);
router.delete('/:activityId', deleteActivity);

export default router;
