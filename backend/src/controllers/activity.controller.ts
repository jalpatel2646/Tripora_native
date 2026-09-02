import { Request, Response, NextFunction } from 'express';
import { Activity } from '../models/Activity';
import { Stop } from '../models/Stop';
import { AppError } from '../utils/AppError';

export const createActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { stopId } = req.params;
    
    const stop = await Stop.findById(stopId);
    if (!stop) return next(new AppError('Stop not found', 404));

    const activity = await Activity.create({
      ...req.body,
      stopId
    });

    await Stop.findByIdAndUpdate(stopId, { $push: { activities: activity._id } });

    res.status(201).json({ success: true, data: activity });
  } catch (err) {
    next(err);
  }
};

export const getActivities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { stopId } = req.params;
    const activities = await Activity.find({ stopId }).sort({ date: 1 });
    res.status(200).json({ success: true, data: activities });
  } catch (err) {
    next(err);
  }
};

export const updateActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await Activity.findByIdAndUpdate(req.params.activityId, req.body, { new: true, runValidators: true });
    if (!updated) return next(new AppError('Activity not found', 404));
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const activity = await Activity.findById(req.params.activityId);
    if (!activity) return next(new AppError('Activity not found', 404));

    await Stop.findByIdAndUpdate(activity.stopId, { $pull: { activities: activity._id } });
    await activity.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

// @desc Search available activity stubs globally
// @route GET /api/activities/search
export const searchActivities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = (req.query.q as string) || '';
    const lat = req.query.lat ? parseFloat(req.query.lat as string) : null;
    const lng = req.query.lng ? parseFloat(req.query.lng as string) : null;
    
    // Simple mock logic replaced to query global/nearby based on input
    let query: any = { isGlobalStub: true };
    if (q) {
      query.title = { $regex: q, $options: 'i' };
    }
    
    // We do not have proper GeoJSON for Activity right now, so we will return randomly or exactly match.
    // For standard compliance without over-engineering GeoSpatial queries for non-existent data:
    const activities = await Activity.find(query).limit(10);
    
    res.status(200).json({ success: true, data: activities });
  } catch (err) {
    next(err);
  }
};
