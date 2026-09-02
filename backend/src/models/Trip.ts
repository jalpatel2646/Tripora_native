import mongoose, { Schema, Document } from 'mongoose';

export interface ITrip extends Document {
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  coverPhoto?: string;
  budgetLimit?: number;
  estimatedTotalCost?: number;
  originalEstimatedCost?: number;
  optimizedCost?: number;
  savings: number;
  isOptimized: boolean;
  costBreakdown: {
    transport: number;
    accommodation: number;
    food: number;
    activities: number;
    miscellaneous: number;
  };
  optimizationHistory: any[];
  owner: mongoose.Types.ObjectId;
  companions: { userId: mongoose.Types.ObjectId, role: 'OWNER' | 'COMPANION' | 'VIEWER' }[];
  stops: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const TripSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  coverPhoto: { type: String },
  budgetLimit: { type: Number },
  estimatedTotalCost: { type: Number },
  originalEstimatedCost: { type: Number },
  optimizedCost: { type: Number },
  savings: { type: Number, default: 0 },
  isOptimized: { type: Boolean, default: false },
  costBreakdown: {
    transport: { type: Number, default: 0 },
    accommodation: { type: Number, default: 0 },
    food: { type: Number, default: 0 },
    activities: { type: Number, default: 0 },
    miscellaneous: { type: Number, default: 0 }
  },
  optimizationHistory: [{ type: Schema.Types.Mixed }],
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  companions: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['OWNER', 'COMPANION', 'VIEWER'], default: 'COMPANION' }
  }],
  stops: [{ type: Schema.Types.ObjectId, ref: 'Stop' }]
}, { timestamps: true });

TripSchema.index({ owner: 1, createdAt: -1 });

export const Trip = mongoose.model<ITrip>('Trip', TripSchema);
