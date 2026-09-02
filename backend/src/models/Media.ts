import mongoose, { Schema, Document } from 'mongoose';

export interface IMediaComment {
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  text: string;
  createdAt: Date;
}

export interface IMedia extends Document {
  userId: mongoose.Types.ObjectId;
  tripId?: mongoose.Types.ObjectId;
  activityId?: mongoose.Types.ObjectId;
  url: string;
  publicId?: string; // e.g. for Cloudinary
  caption?: string;
  mimeType?: string;
  size?: number;
  width?: number;
  height?: number;
  comments: IMediaComment[];
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tripId: { type: Schema.Types.ObjectId, ref: 'Trip' },
  activityId: { type: Schema.Types.ObjectId, ref: 'Activity' },
  url: { type: String, required: true },
  publicId: { type: String },
  caption: { type: String },
  mimeType: { type: String },
  size: { type: Number },
  width: { type: Number },
  height: { type: Number },
  comments: [
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

MediaSchema.index({ tripId: 1, createdAt: -1 });
MediaSchema.index({ activityId: 1, createdAt: -1 });

export const Media = mongoose.model<IMedia>('Media', MediaSchema);
