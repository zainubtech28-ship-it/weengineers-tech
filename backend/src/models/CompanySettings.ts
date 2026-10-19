import mongoose, { Document, Schema } from 'mongoose';

export interface ICompanySettings extends Document {
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
  createdAt: Date;
  updatedAt: Date;
}

const CompanySettingsSchema = new Schema<ICompanySettings>(
  {
    companyName: { type: String, default: 'WEENGINEERS TECH' },
    tagline: { type: String, default: 'YOUR VISION. OUR MISSION. BEYOND EXPECTATIONS.' },
    aboutStory: {
      type: String,
      default:
        'WEENGINEERS TECH is a premier IT consulting and custom software development enterprise. We bridge visionary ideas with cutting-edge engineering, delivering enterprise-grade web applications, cloud architectures, and digital transformations that exceed expectations.',
    },
    mission: {
      type: String,
      default:
        'To empower forward-thinking businesses worldwide through robust, scalable, and human-centric software solutions engineered to perfection.',
    },
    vision: {
      type: String,
      default:
        'To be the globally benchmarked engineering partner that turns ambitious visions into high-performing digital realities.',
    },
    values: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        icon: { type: String },
      },
    ],
    contactEmail: { type: String, default: 'contact@weengineers.tech' },
    phone: { type: String, default: '+1 (555) 019-2834' },
    address: { type: String, default: 'Innovation Tech Hub, Silicon Boulevard' },
    whatsappNumber: { type: String, default: '+15550192834' },
    socialLinks: {
      linkedin: { type: String, default: 'https://linkedin.com/company/weengineers-tech' },
      twitter: { type: String, default: 'https://twitter.com/weengineers' },
      github: { type: String, default: 'https://github.com/weengineers' },
      instagram: { type: String, default: 'https://instagram.com/weengineers' },
      youtube: { type: String, default: '' },
    },
    branding: {
      primaryColor: { type: String, default: '#1e40af' },
      accentColor: { type: String, default: '#2563eb' },
      logoUrl: { type: String, default: '/LOGO.jpeg' },
    },
    maintenanceMode: { type: Boolean, default: false },
    publicWebsiteConfig: {
      enableEnquiries: { type: Boolean, default: true },
      enableReviews: { type: Boolean, default: true },
      enableBlog: { type: Boolean, default: true },
      showStats: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export const CompanySettings = mongoose.model<ICompanySettings>('CompanySettings', CompanySettingsSchema);
