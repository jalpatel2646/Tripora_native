import { Request, Response, NextFunction } from 'express';
import { Contact } from '../models/Contact';
import { AppError } from '../utils/AppError';

export const createContact = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contact = await Contact.create({
      ...req.body,
      userId: req.user._id
    });
    res.status(201).json({ success: true, data: contact });
  } catch (err) {
    next(err);
  }
};

export const getContacts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contacts = await Contact.find({ userId: req.user._id });
    res.status(200).json({ success: true, data: contacts });
  } catch (err) {
    next(err);
  }
};

export const updateContact = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contact = await Contact.findOneAndUpdate(
      { _id: req.params.contactId, userId: req.user._id }, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!contact) return next(new AppError('Contact not found or unauthorized', 404));
    res.status(200).json({ success: true, data: contact });
  } catch (err) {
    next(err);
  }
};

export const deleteContact = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contact = await Contact.findOneAndDelete({ _id: req.params.contactId, userId: req.user._id });
    if (!contact) return next(new AppError('Contact not found or unauthorized', 404));
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
