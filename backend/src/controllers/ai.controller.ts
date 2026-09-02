import { Request, Response, NextFunction } from 'express';
import { generateTripPlanService } from '../services/ai.service';
import { AppError } from '../utils/AppError';

// @desc    Generate AI Trip Plan
// @route   POST /api/ai/plan
// @access  Private
export const generatePlan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return next(new AppError('Prompt is required', 400));
    }

    const tripPlan = await generateTripPlanService(prompt);

    res.status(200).json({ success: true, data: tripPlan });
  } catch (err: any) {
    next(new AppError(err.message, 500));
  }
};
