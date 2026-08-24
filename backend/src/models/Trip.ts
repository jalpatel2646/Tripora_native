import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  coverImage: { type: String },
  stops: [{
    cityName: String,
    country: String,
    startDate: Date,
    endDate: Date,
    activities: [{
      title: String,
      type: String,
      duration: String,
      cost: Number
    }]
  }],
}, { timestamps: true });

export const Trip = mongoose.model('Trip', tripSchema);
