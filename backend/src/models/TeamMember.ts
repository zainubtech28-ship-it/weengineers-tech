import mongoose, { Document, Schema } from 'mongoose';

export interface ITeamMember extends Document {
  name: string;
  designation: string;
  bio?: string;
  skills?: string[];
  photoUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  email?: string;
  isFounder: boolean;
  isVisible: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const TeamMemberSchema = new Schema<ITeamMember>(
  {
    name: { type: String, required: true, trim: true },
    designation: {
      type: String,
      required: true,
      trim: true,
      default: 'B.Tech Information Technology — 3rd Year',
    },
    bio: { type: String, default: '' },
    skills: [{ type: String }],
    photoUrl: { type: String, default: '' },
    linkedinUrl: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
    email: { type: String, default: '' },
    isFounder: { type: Boolean, default: false },
    isVisible: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const TeamMember = mongoose.model<ITeamMember>('TeamMember', TeamMemberSchema);
