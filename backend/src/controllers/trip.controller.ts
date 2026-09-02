import { Request, Response, NextFunction } from 'express';
import { Trip } from '../models/Trip';
import { Stop } from '../models/Stop';
import { Activity } from '../models/Activity';
import { Media } from '../models/Media';
import { Expense } from '../models/Expense';
import { AppError } from '../utils/AppError';

// @desc    Create new trip
// @route   POST /api/trips
// @access  Private
export const createTrip = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const trip = await Trip.create({
      ...req.body,
      owner: req.user._id,
      companions: [{ userId: req.user._id, role: 'OWNER' }]
    });
    res.status(201).json({ success: true, data: trip });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all trips for logged in user
// @route   GET /api/trips
// @access  Private
export const getTrips = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const trips = await Trip.find({
      $or: [
        { owner: req.user._id },
        { 'companions.userId': req.user._id }
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: trips });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single trip
// @route   GET /api/trips/:id
// @access  Private
export const getTrip = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('stops');
      
    if (!trip) return next(new AppError('Trip not found', 404));

    // Authorization
    const isOwner = trip.owner.toString() === req.user._id.toString();
    const isCompanion = trip.companions.some(c => c.userId.toString() === req.user._id.toString());
    
    if (!isOwner && !isCompanion) {
      return next(new AppError('Not authorized to access this trip', 403));
    }

    res.status(200).json({ success: true, data: trip });
  } catch (err) {
    next(err);
  }
};

// @desc    Update trip
// @route   PATCH /api/trips/:id
// @access  Private
export const updateTrip = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let trip = await Trip.findById(req.params.id);
    if (!trip) return next(new AppError('Trip not found', 404));

    const isOwner = trip.owner.toString() === req.user._id.toString();
    const isEditCompanion = trip.companions.some(c => c.userId.toString() === req.user._id.toString() && (c.role === 'OWNER' || c.role === 'COMPANION'));
    
    if (!isOwner && !isEditCompanion) {
      return next(new AppError('Not authorized to update this trip', 403));
    }

    trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: trip });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete trip (and cascade)
// @route   DELETE /api/trips/:id
// @access  Private
export const deleteTrip = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return next(new AppError('Trip not found', 404));

    if (trip.owner.toString() !== req.user._id.toString()) {
      return next(new AppError('Not authorized to delete this trip', 403));
    }

    // Cascade delete related entities
    await Stop.deleteMany({ tripId: trip._id });
    // Also delete activities, expenses, media. (Requires complex cascading, simplifying here for now)
    
    await trip.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

// @desc    Set trip cover photo
// @route   PATCH /api/trips/:id/cover
// @access  Private
export const setTripCover = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { mediaId } = req.body;
    let trip = await Trip.findById(req.params.id);
    if (!trip) return next(new AppError('Trip not found', 404));

    // Simple ownership check
    if (trip.owner.toString() !== req.user._id.toString()) {
      return next(new AppError('Not authorized', 403));
    }

    const media = await Media.findById(mediaId);
    if (!media || media.tripId?.toString() !== trip._id.toString()) {
      return next(new AppError('Media not found or does not belong to trip', 400));
    }

    trip.coverPhoto = media.url;
    await trip.save();

    res.status(200).json({ success: true, data: trip });
  } catch (err) {
    next(err);
  }
};

import { optimizeBudgetService } from '../services/budgetOptimization.service';

// @desc    Optimize trip budget using Service
// @route   PATCH /api/trips/:id/optimize
// @access  Private
export const optimizeTrip = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let trip = await Trip.findById(req.params.id);
    if (!trip) return next(new AppError('Trip not found', 404));

    const isOwner = trip.owner.toString() === req.user._id.toString();
    const isEditCompanion = trip.companions.some(c => c.userId.toString() === req.user._id.toString() && (c.role === 'OWNER' || c.role === 'COMPANION'));
    
    if (!isOwner && !isEditCompanion) {
      return next(new AppError('Not authorized to optimize this trip', 403));
    }

    if (trip.isOptimized && req.body.apply) {
      return res.status(400).json({ success: false, message: 'Trip is already optimized.' });
    }

    const currentCost = trip.estimatedTotalCost || 0;
    const budgetLimit = trip.budgetLimit || 0;
    
    if (currentCost === 0) {
      return res.status(400).json({ success: false, message: 'No costs to optimize.' });
    }
    
    if (budgetLimit === 0) {
        return res.status(400).json({ success: false, message: 'No budget limit set for optimization.'});
    }

    const optimizationResult = optimizeBudgetService(currentCost, budgetLimit, trip.costBreakdown as any);

    if (req.body.apply) {
      trip.originalEstimatedCost = currentCost;
      trip.estimatedTotalCost = optimizationResult.optimizedTotal;
      trip.optimizedCost = optimizationResult.optimizedTotal;
      trip.savings = optimizationResult.actualSavings;
      trip.costBreakdown = optimizationResult.optimizedBreakdown as any;
      trip.isOptimized = true;
      await trip.save();
    }

    res.status(200).json({ 
      success: true, 
      originalCost: currentCost, 
      optimizedTotal: optimizationResult.optimizedTotal, 
      savings: optimizationResult.actualSavings, 
      suggestions: optimizationResult.suggestions,
      optimizedBreakdown: optimizationResult.optimizedBreakdown
    });
  } catch (err) {
    next(err);
  }
};

import { getTripInsightsService } from '../services/tripInsights.service';

// @desc    Get trip insights
// @route   GET /api/trips/:id/insights
// @access  Private
export const getTripInsights = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const insights = await getTripInsightsService(req.params.id);
    res.status(200).json({ success: true, data: insights });
  } catch (err) {
    next(err);
  }
};

