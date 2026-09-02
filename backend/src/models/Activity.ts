import mongoose, { Schema, Document } from 'mongoose';

export interface IActivity extends Document {
  stopId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  cost?: number;
  notes?: string;
  media: mongoose.Types.ObjectId[];
}

const ActivitySchema: Schema = new Schema({
  stopId: { type: Schema.Types.ObjectId, ref: 'Stop', required: true },
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  startTime: { type: String },
  endTime: { type: String },
  location: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  cost: { type: Number },
  notes: { type: String },
  media: [{ type: Schema.Types.ObjectId, ref: 'Media' }]
}, { timestamps: true });

ActivitySchema.index({ stopId: 1, date: 1 });

export const Activity = mongoose.model<IActivity>('Activity', ActivitySchema);
