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

import { User } from '../models/User';

// @desc    Match device contacts with registered users securely
// @route   POST /api/contacts/match
// @access  Private
export const matchDeviceContacts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { contacts } = req.body;
    
    if (!Array.isArray(contacts)) {
      return next(new AppError('Contacts must be an array', 400));
    }

    // Extract valid emails and phones to check against DB
    const emails = contacts.filter(c => c.email).map(c => c.email.toLowerCase());
    // Strip non-digit characters from phones for a basic matching strategy
    const phones = contacts.filter(c => c.phone).map(c => c.phone.replace(/\D/g, ''));

    // Find users who have matching emails or phones (if you saved phones in User model, assume emails for now if phone isn't supported)
    const matchedUsers = await User.find({
      $or: [
        { email: { $in: emails } },
        // { phone: { $in: phones } } // If user model had a phone
      ]
    }).select('_id email firstName lastName displayName avatarUrl');

    const matchedEmails = new Set(matchedUsers.map(u => u.email.toLowerCase()));

    const result = contacts.map(c => ({
      ...c,
      isTriporaUser: (c.email && matchedEmails.has(c.email.toLowerCase())) || false
    }));

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};
