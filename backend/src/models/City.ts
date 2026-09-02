import mongoose, { Schema, Document } from 'mongoose';

export interface ICity extends Document {
  name: string;
  country: string;
  region: string;
  imageUrl?: string;
  popularity?: string;
  costIndex?: string;
}

const CitySchema: Schema = new Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  region: { type: String, required: true },
  imageUrl: { type: String },
  popularity: { type: String },
  costIndex: { type: String }
});

CitySchema.index({ name: 'text', country: 'text' });

export const City = mongoose.model<ICity>('City', CitySchema);
