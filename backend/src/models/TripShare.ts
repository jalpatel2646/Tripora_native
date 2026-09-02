import mongoose, { Schema, Document } from 'mongoose';

export interface ITripShare extends Document {
  tripId: mongoose.Types.ObjectId;
  token: string;
  createdBy: mongoose.Types.ObjectId;
  status: 'ACTIVE' | 'REVOKED';
  permissions: 'VIEW' | 'EDIT';
}

const TripShareSchema: Schema = new Schema({
  tripId: { type: Schema.Types.ObjectId, ref: 'Trip', required: true },
  token: { type: String, required: true, unique: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['ACTIVE', 'REVOKED'], default: 'ACTIVE' },
  permissions: { type: String, enum: ['VIEW', 'EDIT'], default: 'VIEW' }
}, { timestamps: true });

TripShareSchema.index({ token: 1 });

export const TripShare = mongoose.model<ITripShare>('TripShare', TripShareSchema);
