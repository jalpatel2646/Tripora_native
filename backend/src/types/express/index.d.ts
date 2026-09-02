import { IUser } from '../../models/User';

declare global {
  namespace Express {
    interface Request {
      user?: IUser | any; // allow any to quickly bypass mongoose document mismatch in basic types
    }
  }
}
