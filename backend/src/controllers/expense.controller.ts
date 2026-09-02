import { Request, Response, NextFunction } from 'express';
import { Expense } from '../models/Expense';
import { Trip } from '../models/Trip';
import { AppError } from '../utils/AppError';

export const createExpense = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tripId } = req.params;
    const trip = await Trip.findById(tripId);
    if (!trip) return next(new AppError('Trip not found', 404));

    const expense = await Expense.create({
      ...req.body,
      tripId,
      createdBy: req.user._id
    });
    res.status(201).json({ success: true, data: expense });
  } catch (err) {
    next(err);
  }
};

export const getExpenses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const expenses = await Expense.find({ tripId: req.params.tripId }).sort({ date: -1 });
    res.status(200).json({ success: true, data: expenses });
  } catch (err) {
    next(err);
  }
};

export const updateExpense = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await Expense.findByIdAndUpdate(req.params.expenseId, req.body, { new: true, runValidators: true });
    if (!updated) return next(new AppError('Expense not found', 404));
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteExpense = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.expenseId);
    if (!expense) return next(new AppError('Expense not found', 404));
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
