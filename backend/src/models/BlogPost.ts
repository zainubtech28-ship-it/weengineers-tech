import mongoose, { Document, Schema } from 'mongoose';

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  coverImage?: string;
  category: string;
  tags: string[];
  readTimeMinutes: number;
  isPublished: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true, default: 'WEENGINEERS Editorial' },
    coverImage: { type: String },
    category: { type: String, required: true, default: 'Technology' },
    tags: [{ type: String }],
    readTimeMinutes: { type: Number, default: 5 },
    isPublished: { type: Boolean, default: true, index: true },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

BlogPostSchema.index({ title: 'text', excerpt: 'text', content: 'text', tags: 'text' });

export const BlogPost = mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);
