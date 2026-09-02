import mongoose, { Schema, Document } from 'mongoose';

export interface IStop extends Document {
  tripId: mongoose.Types.ObjectId;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  startDate: Date;
  endDate: Date;
  order: number;
  notes?: string;
  activities: mongoose.Types.ObjectId[];
}

const StopSchema: Schema = new Schema({
  tripId: { type: Schema.Types.ObjectId, ref: 'Trip', required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  latitude: { type: Number },
  longitude: { type: Number },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  order: { type: Number, required: true },
  notes: { type: String },
  activities: [{ type: Schema.Types.ObjectId, ref: 'Activity' }]
}, { timestamps: true });

StopSchema.index({ tripId: 1, order: 1 });

export const Stop = mongoose.model<IStop>('Stop', StopSchema);
