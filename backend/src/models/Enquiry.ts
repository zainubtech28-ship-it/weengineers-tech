import mongoose, { Document, Schema } from 'mongoose';

export interface IEnquiryNote {
  note: string;
  authorName: string;
  authorEmail: string;
  createdAt: Date;
}

export interface IEnquiryHistory {
  status: string;
  changedBy: string;
  changedAt: Date;
  note?: string;
}

export interface IEnquiry extends Document {
  referenceCode: string;
  fullName: string;
  email: string;
  phone?: string;
  companyName?: string;
  service: string;
  budget?: string;
  timeline?: string;
  description: string;
  preferredContactMethod: 'email' | 'phone' | 'whatsapp';
  status: 'New' | 'Contacted' | 'Qualified' | 'Proposal Sent' | 'In Progress' | 'Completed' | 'Rejected';
  internalNotes: IEnquiryNote[];
  assignedTo?: mongoose.Types.ObjectId;
  followUpDate?: Date;
  history: IEnquiryHistory[];
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema = new Schema<IEnquiry>(
  {
    referenceCode: { type: String, required: true, unique: true, uppercase: true, index: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    companyName: { type: String, trim: true },
    service: { type: String, required: true },
    budget: { type: String },
    timeline: { type: String },
    description: { type: String, required: true },
    preferredContactMethod: { type: String, enum: ['email', 'phone', 'whatsapp'], default: 'email' },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'In Progress', 'Completed', 'Rejected'],
      default: 'New',
      index: true,
    },
    internalNotes: [
      {
        note: { type: String, required: true },
        authorName: { type: String, required: true },
        authorEmail: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    followUpDate: { type: Date },
    history: [
      {
        status: { type: String, required: true },
        changedBy: { type: String, required: true },
        changedAt: { type: Date, default: Date.now },
        note: { type: String },
      },
    ],
  },
  { timestamps: true }
);

EnquirySchema.index({ fullName: 'text', email: 'text', companyName: 'text', description: 'text' });

export const Enquiry = mongoose.model<IEnquiry>('Enquiry', EnquirySchema);
