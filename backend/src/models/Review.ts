import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  clientName: string;
  clientCompany?: string;
  clientRole?: string;
  rating: number;
  reviewText: string;
  projectId?: mongoose.Types.ObjectId;
  status: 'pending' | 'approved' | 'rejected';
  isVerified: boolean;
  isFlagged: boolean;
  flagReason?: string;
  moderationHistory: {
    status: string;
    moderatedBy: string;
    moderatedAt: Date;
    note?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    clientName: { type: String, required: true, trim: true },
    clientCompany: { type: String, trim: true },
    clientRole: { type: String, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    reviewText: { type: String, required: true, trim: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
    isVerified: { type: Boolean, default: false },
    isFlagged: { type: Boolean, default: false },
    flagReason: { type: String },
    moderationHistory: [
      {
        status: { type: String, required: true },
        moderatedBy: { type: String, required: true },
        moderatedAt: { type: Date, default: Date.now },
        note: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export const Review = mongoose.model<IReview>('Review', ReviewSchema);
