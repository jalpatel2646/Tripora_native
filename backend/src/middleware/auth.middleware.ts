import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AppError } from '../utils/AppError';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token;
    
    // 1. Getting token and check if it's there
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }
    
    // 2. Verification token
    const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey123';
    const decoded: any = jwt.verify(token, JWT_SECRET);
    
    // 3. Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
       return next(new AppError('The user belonging to this token does no longer exist.', 401));
    }
    
    // Grant access to protected route
    req.user = currentUser;
    next();
  } catch (err: any) {
    if (err.name === 'JsonWebTokenError') {
       return next(new AppError('Invalid token. Please log in again!', 401));
    }
    if (err.name === 'TokenExpiredError') {
       return next(new AppError('Your token has expired! Please log in again.', 401));
    }
    return next(new AppError('Authentication error', 500));
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Assuming the user model has a 'role' field
    if (!roles.includes(req.user.role || 'USER')) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};
