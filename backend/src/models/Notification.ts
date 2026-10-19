import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  title: string;
  message: string;
  type: 'enquiry' | 'review' | 'system' | 'security';
  link?: string;
  isRead: boolean;
  targetRole?: 'founder' | 'admin' | 'all';
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['enquiry', 'review', 'system', 'security'], default: 'system' },
    link: { type: String },
    isRead: { type: Boolean, default: false },
    targetRole: { type: String, enum: ['founder', 'admin', 'all'], default: 'all' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

NotificationSchema.index({ isRead: 1, createdAt: -1 });

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
