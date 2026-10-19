import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  title: string;
  slug: string;
  category: string;
  description: string;
  fullDescription?: string;
  technologies: string[];
  clientIndustry?: string;
  problemStatement?: string;
  solution?: string;
  developmentProcess?: string[];
  measurableResults?: string[];
  liveUrl?: string;
  githubUrl?: string;
  thumbnailUrl: string;
  screenshots: string[];
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
  order: number;
  clientFeedback?: {
    clientName?: string;
    clientCompany?: string;
    comment?: string;
    rating?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    fullDescription: { type: String },
    technologies: [{ type: String, trim: true }],
    clientIndustry: { type: String },
    problemStatement: { type: String },
    solution: { type: String },
    developmentProcess: [{ type: String }],
    measurableResults: [{ type: String }],
    liveUrl: { type: String },
    githubUrl: { type: String },
    thumbnailUrl: { type: String, required: true },
    screenshots: [{ type: String }],
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft', index: true },
    isFeatured: { type: Boolean, default: false, index: true },
    order: { type: Number, default: 0 },
    clientFeedback: {
      clientName: { type: String },
      clientCompany: { type: String },
      comment: { type: String },
      rating: { type: Number, min: 1, max: 5 },
    },
  },
  { timestamps: true }
);

ProjectSchema.index({ title: 'text', description: 'text', category: 'text', technologies: 'text' });

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
