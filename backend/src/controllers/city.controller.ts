import { Request, Response, NextFunction } from 'express';
import { City } from '../models/City';

export const searchCities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = (req.query.q as string) || '';
    const region = (req.query.region as string) || 'All';
    let query: any = {};
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { country: { $regex: q, $options: 'i' } }
      ];
    }
    if (region && region !== 'All') {
      query.region = region;
    }
    const cities = await City.find(query).limit(20);
    res.status(200).json({ success: true, data: cities });
  } catch (err) {
    next(err);
  }
};
