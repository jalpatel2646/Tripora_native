import { Router } from 'express';
import { addCompanion, getCompanions, removeCompanion } from '../controllers/companion.controller';

const router = Router({ mergeParams: true });

router.post('/', addCompanion);
router.get('/', getCompanions);
router.delete('/:userId', removeCompanion);

export default router;
