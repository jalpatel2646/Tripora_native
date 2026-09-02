import { Router } from 'express';
import { uploadMediaItem, getTripMedia, updateMediaCaption, deleteMedia, addMediaComment, deleteMediaComment } from '../controllers/media.controller';
import { uploadMedia } from '../middleware/upload.middleware';

// Note: This router can be mounted at /trips/:tripId/media AND /activities/:activityId/media AND globally at /media/:id
const router = Router({ mergeParams: true });

router.post('/', uploadMedia.single('file'), uploadMediaItem);
router.get('/', getTripMedia);
router.patch('/:id', updateMediaCaption);
router.delete('/:id', deleteMedia);
router.post('/:id/comments', addMediaComment);
router.delete('/:id/comments/:commentId', deleteMediaComment);

export default router;
