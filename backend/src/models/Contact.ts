import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  phone?: string;
  email?: string;
  relationship?: string;
  type: 'TRAVEL_COMPANION' | 'EMERGENCY';
}

const ContactSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  phone: { type: String },
  email: { type: String },
  relationship: { type: String },
  type: { type: String, enum: ['TRAVEL_COMPANION', 'EMERGENCY'], required: true }
}, { timestamps: true });

ContactSchema.index({ userId: 1, type: 1 });

export const Contact = mongoose.model<IContact>('Contact', ContactSchema);
