import { Request, Response, NextFunction } from 'express';
import { Media } from '../models/Media';
import { Trip } from '../models/Trip';
import { Activity } from '../models/Activity';
import { AppError } from '../utils/AppError';
import cloudinary from '../config/cloudinary';

// @desc    Upload new media to trip / activity
// @route   POST /api/trips/:tripId/media or POST /api/activities/:activityId/media
// @access  Private
// Uses uploadMedia.single('file') middleware before this controller
export const uploadMediaItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tripId, activityId } = req.params;
    
    // Check if trip exists and user has access
    if (tripId) {
      const trip = await Trip.findById(tripId);
      if (!trip) return next(new AppError('Trip not found', 404));
      
      const isOwner = trip.owner.toString() === req.user._id.toString();
      const isCompanion = trip.companions.some(c => c.userId.toString() === req.user._id.toString() && c.role !== 'VIEWER');
      
      if (!isOwner && !isCompanion) {
        return next(new AppError('Not authorized to upload to this trip', 403));
      }
    }

    if (!(req as any).file) {
      return next(new AppError('Please upload an image file', 400));
    }

    const { path, filename, size, mimetype } = (req as any).file;

    const media = await Media.create({
      userId: req.user._id,
      tripId: tripId as any,
      activityId: activityId as any,
      url: path,
      publicId: filename,
      size,
      mimeType: mimetype
    }) as any;

    if (activityId) {
      // Optional: enforce max photos limitation
      const activityPhotosCount = await Media.countDocuments({ activityId });
      const MAX_ACTIVITY_PHOTOS = process.env.MAX_ACTIVITY_PHOTOS ? parseInt(process.env.MAX_ACTIVITY_PHOTOS) : 5;
      
      if (activityPhotosCount > MAX_ACTIVITY_PHOTOS) {
         await cloudinary.uploader.destroy(filename);
         await media.deleteOne();
         return next(new AppError(`Maximum limit of ${MAX_ACTIVITY_PHOTOS} photos reached for this activity`, 400));
      }

      await Activity.findByIdAndUpdate(activityId, { $push: { media: media._id } });
    }

    res.status(201).json({ success: true, data: media });
  } catch (err) {
    next(err);
  }
};

// @desc    Get trip media gallery
// @route   GET /api/trips/:tripId/media
// @access  Private
export const getTripMedia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return next(new AppError('Trip not found', 404));

    // Basic access check
    const isOwner = trip.owner.toString() === req.user._id.toString();
    const isCompanion = trip.companions.some(c => c.userId.toString() === req.user._id.toString());
    
    if (!isOwner && !isCompanion) {
      return next(new AppError('Not authorized', 403));
    }

    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 20;
    const skip = (page - 1) * limit;

    const media = await Media.find({ tripId: trip._id })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Media.countDocuments({ tripId: trip._id });

    res.status(200).json({
      success: true,
      data: media,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (err) {
    next(err);
  }
};

// @desc    Update media caption
// @route   PATCH /api/media/:id
// @access  Private
export const updateMediaCaption = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let media = await Media.findById(req.params.id);
    if (!media) return next(new AppError('Media not found', 404));

    if (media.userId.toString() !== req.user._id.toString()) {
      return next(new AppError('Not authorized', 403));
    }

    media.caption = req.body.caption || media.caption;
    await media.save();

    res.status(200).json({ success: true, data: media });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete media
// @route   DELETE /api/media/:id
// @access  Private
export const deleteMedia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return next(new AppError('Media not found', 404));

    if (media.userId.toString() !== req.user._id.toString()) {
      return next(new AppError('Not authorized to delete this photo', 403));
    }

    if (media.publicId) {
      await cloudinary.uploader.destroy(media.publicId);
    }
    
    if (media.activityId) {
      await Activity.findByIdAndUpdate(media.activityId, { $pull: { media: media._id } });
    }

    if (media.tripId) {
      const trip = await Trip.findById(media.tripId);
      if (trip && trip.coverPhoto === media.url) {
        trip.coverPhoto = undefined;
        await trip.save();
      }
    }

    await media.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
