import { Router } from 'express';
import { createShare, getSharedTrip, revokeShare } from '../controllers/share.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router({ mergeParams: true });

// Public route to view shared trip
router.get('/:shareToken', getSharedTrip);

// Protected routes for managing shares
router.post('/trips/:tripId/share', protect, createShare);
router.delete('/trips/:tripId/share', protect, revokeShare);

export default router;
