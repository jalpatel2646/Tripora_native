import { Request, Response, NextFunction } from 'express';
import { Trip } from '../models/Trip';
import { AppError } from '../utils/AppError';

export const addCompanion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tripId } = req.params;
    const { userId, role } = req.body;

    const trip = await Trip.findById(tripId);
    if (!trip) return next(new AppError('Trip not found', 404));

    if (trip.owner.toString() !== req.user._id.toString()) {
      return next(new AppError('Not authorized to add companions', 403));
    }

    if (trip.companions.some(c => c.userId.toString() === userId)) {
      return next(new AppError('User is already a companion', 400));
    }

    trip.companions.push({ userId, role: role || 'VIEWER' });
    await trip.save();

    res.status(201).json({ success: true, data: trip });
  } catch (err) {
    next(err);
  }
};

export const getCompanions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const trip = await Trip.findById(req.params.tripId).populate('companions.userId', 'name email profilePhoto');
    if (!trip) return next(new AppError('Trip not found', 404));

    res.status(200).json({ success: true, data: trip.companions });
  } catch (err) {
    next(err);
  }
};

export const removeCompanion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tripId, userId } = req.params;
    const trip = await Trip.findById(tripId);
    if (!trip) return next(new AppError('Trip not found', 404));

    if (trip.owner.toString() !== req.user._id.toString() && req.user._id.toString() !== userId) {
      return next(new AppError('Not authorized', 403));
    }

    trip.companions = trip.companions.filter(c => c.userId.toString() !== userId) as any;
    await trip.save();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
