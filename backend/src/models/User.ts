import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  profilePhoto?: string;
  preferences?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  profilePhoto: { type: String },
  preferences: [{ type: String }]
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', UserSchema);
