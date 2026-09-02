import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { TripShare } from '../models/TripShare';
import { Trip } from '../models/Trip';
import { AppError } from '../utils/AppError';

export const createShare = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tripId } = req.params;
    const { permissions } = req.body;

    const trip = await Trip.findById(tripId);
    if (!trip) return next(new AppError('Trip not found', 404));
    
    if (trip.owner.toString() !== req.user._id.toString()) {
       return next(new AppError('Only the owner can share this trip', 403));
    }

    const token = crypto.randomBytes(32).toString('hex');
    const share = await TripShare.create({
      tripId: tripId as any,
      token,
      createdBy: req.user._id,
      permissions: permissions || 'VIEW'
    });

    res.status(201).json({ success: true, data: share, link: `/shared/${token}` });
  } catch (err) {
    next(err);
  }
};

export const getSharedTrip = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const share = await TripShare.findOne({ token: req.params.shareToken, status: 'ACTIVE' });
    if (!share) return next(new AppError('Invalid or expired share token', 404));

    const trip = await Trip.findById(share.tripId)
      .populate('stops')
      .populate('owner', 'name email profilePhoto');

    if (!trip) return next(new AppError('Shared trip no longer exists', 404));

    res.status(200).json({ success: true, data: { trip, permissions: share.permissions } });
  } catch (err) {
    next(err);
  }
};

export const revokeShare = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tripId } = req.params;
    
    // Revoke all shares for this trip
    await TripShare.updateMany({ tripId, createdBy: req.user._id }, { status: 'REVOKED' });

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
