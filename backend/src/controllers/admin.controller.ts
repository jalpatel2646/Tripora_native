import { Request, Response, NextFunction } from 'express';
import { Trip } from '../models/Trip';
import { User } from '../models/User';
import { Activity } from '../models/Activity';
import { Stop } from '../models/Stop';

export const getAdminMetrics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTrips = await Trip.countDocuments();
    const totalActivities = await Activity.countDocuments();
    const totalStops = await Stop.countDocuments();

    // Just aggregation examples
    const result = {
      totalUsers,
      totalTrips,
      totalActivities,
      totalDestinations: totalStops,
      activeUsers: totalUsers, // simplistic
      avgTripDuration: Math.floor(Math.random() * 5) + 3,
      avgTripBudget: 1500
    };

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};
