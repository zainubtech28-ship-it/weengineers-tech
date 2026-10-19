export interface User {
  id: string;
  name: string;
  email: string;
  role: 'founder' | 'admin';
  avatar?: string;
  phone?: string;
  permissions?: string[];
  createdAt?: string;
}

export interface ServiceItem {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  benefits: string[];
  process: { step: number; title: string; description: string }[];
  technologies: string[];
  faqs: { question: string; answer: string }[];
  isPublished: boolean;
  order: number;
}

export interface ProjectItem {
  _id: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface TeamMemberItem {
  _id: string;
  name: string;
  designation: string;
  bio?: string;
  skills?: string[];
  photoUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  email?: string;
  isFounder?: boolean;
  isVisible: boolean;
  order: number;
}

export interface ReviewItem {
  _id: string;
  clientName: string;
  clientCompany?: string;
  clientRole?: string;
  rating: number;
  reviewText: string;
  projectId?: {
    _id: string;
    title: string;
    slug: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  isVerified: boolean;
  isFlagged: boolean;
  flagReason?: string;
  createdAt: string;
}

export interface EnquiryItem {
  _id: string;
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
  internalNotes: {
    note: string;
    authorName: string;
    authorEmail: string;
    createdAt: string;
  }[];
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  };
  history: {
    status: string;
    changedBy: string;
    changedAt: string;
    note?: string;
  }[];
  createdAt: string;
}

export interface FAQItem {
  _id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isPublished: boolean;
}

export interface BlogPostItem {
  _id: string;
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
  publishedAt: string;
}

export interface CompanySettingsData {
  companyName: string;
  tagline: string;
  aboutStory: string;
  mission: string;
  vision: string;
  values: { title: string; description: string; icon?: string }[];
  contactEmail: string;
  phone: string;
  address: string;
  whatsappNumber?: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    instagram?: string;
    youtube?: string;
  };
  branding: {
    primaryColor: string;
    accentColor: string;
    logoUrl: string;
  };
  maintenanceMode: boolean;
  publicWebsiteConfig: {
    enableEnquiries: boolean;
    enableReviews: boolean;
    enableBlog: boolean;
    showStats: boolean;
  };
}

export interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  type: 'enquiry' | 'review' | 'system' | 'security';
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface AuditLogItem {
  _id: string;
  userEmail: string;
  userRole: string;
  action: string;
  module: string;
  details?: Record<string, any>;
  ipAddress?: string;
  createdAt: string;
}
