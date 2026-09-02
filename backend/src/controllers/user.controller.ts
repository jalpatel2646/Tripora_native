import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { generateRecommendations } from '../services/recommendation.service';
import { AppError } from '../utils/AppError';

// @desc    Get Personalized Recommendations
// @route   GET /api/users/recommendations
// @access  Private
export const getRecommendations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return next(new AppError('User not found', 404));

    const recommended = generateRecommendations(user.preferences || []);

    res.status(200).json({ success: true, data: recommended, preferences: user.preferences });
  } catch (err) {
    next(err);
  }
};

// @desc    Update User Preferences
// @route   PUT /api/users/preferences
// @access  Private
export const updatePreferences = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { preferences } = req.body;
    
    if (!Array.isArray(preferences)) {
      return next(new AppError('Preferences must be an array of strings', 400));
    }

    const user = await User.findByIdAndUpdate(
      req.user._id, 
      { preferences },
      { new: true, runValidators: true }
    );

    if (!user) return next(new AppError('User not found', 404));

    res.status(200).json({ success: true, data: user.preferences });
  } catch (err) {
    next(err);
  }
};
