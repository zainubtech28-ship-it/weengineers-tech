import { Request, Response } from 'express';
import crypto from 'crypto';
import { CompanySettings } from '../models/CompanySettings.js';
import { Service } from '../models/Service.js';
import { Project } from '../models/Project.js';
import { TeamMember } from '../models/TeamMember.js';
import { Review } from '../models/Review.js';
import { Enquiry } from '../models/Enquiry.js';
import { BlogPost } from '../models/BlogPost.js';
import { FAQ } from '../models/FAQ.js';
import { Notification } from '../models/Notification.js';

export const getPublicSettings = async (_req: Request, res: Response): Promise<void> => {
  try {
    let settings = await CompanySettings.findOne();
    if (!settings) {
      settings = await CompanySettings.create({});
    }
    res.json({ success: true, settings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch company details.' });
  }
};

export const getPublicServices = async (_req: Request, res: Response): Promise<void> => {
  try {
    const services = await Service.find({ isPublished: true }).sort({ order: 1, createdAt: 1 });
    res.json({ success: true, count: services.length, services });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch services.' });
  }
};

export const getPublicServiceBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const service = await Service.findOne({ slug, isPublished: true });
    if (!service) {
      res.status(404).json({ success: false, message: 'Service not found.' });
      return;
    }
    res.json({ success: true, service });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch service.' });
  }
};

export const getPublicProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search, page = 1, limit = 9, featured } = req.query;
    const filter: any = { status: 'published' };

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (featured === 'true') {
      filter.isFeatured = true;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { technologies: { $in: [new RegExp(String(search), 'i')] } },
      ];
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 9;
    const skip = (pageNum - 1) * limitNum;

    const [projects, total] = await Promise.all([
      Project.find(filter)
        .sort({ isFeatured: -1, order: 1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Project.countDocuments(filter),
    ]);

    res.json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      projects,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch projects.' });
  }
};

export const getPublicProjectBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const project = await Project.findOne({ slug, status: 'published' });
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found.' });
      return;
    }
    res.json({ success: true, project });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch project.' });
  }
};

export const getPublicTeam = async (_req: Request, res: Response): Promise<void> => {
  try {
    const team = await TeamMember.find({ isVisible: true }).sort({ order: 1, createdAt: 1 });
    res.json({ success: true, team });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch team members.' });
  }
};

export const getPublicReviews = async (_req: Request, res: Response): Promise<void> => {
  try {
    const reviews = await Review.find({ status: 'approved' })
      .populate('projectId', 'title slug')
      .sort({ createdAt: -1 });

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1))
        : 0;

    res.json({
      success: true,
      totalReviews,
      averageRating,
      reviews,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch reviews.' });
  }
};

export const submitPublicReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { clientName, clientCompany, clientRole, rating, reviewText, projectId } = req.body;

    if (!clientName || !rating || !reviewText) {
      res.status(400).json({
        success: false,
        message: 'Name, rating (1-5), and written feedback are required.',
      });
      return;
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5 stars.',
      });
      return;
    }

    const review = await Review.create({
      clientName: clientName.trim(),
      clientCompany: clientCompany ? clientCompany.trim() : undefined,
      clientRole: clientRole ? clientRole.trim() : undefined,
      rating: numRating,
      reviewText: reviewText.trim(),
      projectId: projectId || undefined,
      status: 'pending', // Requires admin moderation
      isVerified: false,
    });

    await Notification.create({
      title: 'New Client Review Submitted',
      message: `${clientName} submitted a ${numRating}-star review requiring moderation.`,
      type: 'review',
      link: '/admin/reviews',
      targetRole: 'all',
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your review has been submitted and will appear following standard verification.',
      reviewId: review._id,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to submit review.' });
  }
};

export const reportReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const review = await Review.findById(id);
    if (!review) {
      res.status(404).json({ success: false, message: 'Review not found.' });
      return;
    }

    review.isFlagged = true;
    review.flagReason = reason || 'Reported by website visitor';
    await review.save();

    await Notification.create({
      title: 'Review Reported',
      message: `Review #${id} flagged for review: "${review.flagReason}"`,
      type: 'review',
      link: '/admin/reviews',
      targetRole: 'all',
    });

    res.json({ success: true, message: 'Review has been reported to moderation team.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to report review.' });
  }
};

export const submitPublicEnquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      fullName,
      email,
      phone,
      companyName,
      service,
      budget,
      timeline,
      description,
      preferredContactMethod,
    } = req.body;

    if (!fullName || !email || !service || !description) {
      res.status(400).json({
        success: false,
        message: 'Full name, email address, service requested, and project description are required.',
      });
      return;
    }

    // Generate unique reference: WE-YEAR-RANDOMHEX (e.g. WE-2026-A8F2)
    const year = new Date().getFullYear();
    const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
    const referenceCode = `WE-${year}-${randomHex}`;

    const enquiry = await Enquiry.create({
      referenceCode,
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone ? phone.trim() : undefined,
      companyName: companyName ? companyName.trim() : undefined,
      service,
      budget,
      timeline,
      description: description.trim(),
      preferredContactMethod: preferredContactMethod || 'email',
      status: 'New',
      history: [
        {
          status: 'New',
          changedBy: 'Client Web Submission',
          changedAt: new Date(),
          note: 'Enquiry initiated via public project enquiry form.',
        },
      ],
    });

    await Notification.create({
      title: `New Project Enquiry: ${referenceCode}`,
      message: `${fullName} submitted an enquiry for ${service}.`,
      type: 'enquiry',
      link: `/admin/enquiries`,
      targetRole: 'all',
    });

    res.status(201).json({
      success: true,
      message: 'Your project enquiry has been registered successfully. Our engineering team will review it and follow up shortly.',
      referenceCode: enquiry.referenceCode,
    });
  } catch (error: any) {
    console.error('Enquiry submission error:', error);
    res.status(500).json({ success: false, message: 'Failed to process your project enquiry.' });
  }
};

export const trackPublicEnquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { referenceCode } = req.params;
    const enquiry = await Enquiry.findOne({ referenceCode: String(referenceCode).toUpperCase().trim() }).select(
      'referenceCode fullName service status createdAt history.status history.changedAt'
    );

    if (!enquiry) {
      res.status(404).json({
        success: false,
        message: 'No project enquiry found with that reference code. Please verify your reference number.',
      });
      return;
    }

    res.json({
      success: true,
      enquiry: {
        referenceCode: enquiry.referenceCode,
        clientName: enquiry.fullName,
        service: enquiry.service,
        status: enquiry.status,
        submittedAt: enquiry.createdAt,
        timeline: enquiry.history.map((h) => ({
          status: h.status,
          date: h.changedAt,
        })),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to track enquiry.' });
  }
};

export const getPublicBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search } = req.query;
    const filter: any = { isPublished: true };

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(String(search), 'i')] } },
      ];
    }

    const blogs = await BlogPost.find(filter).sort({ publishedAt: -1, createdAt: -1 });
    res.json({ success: true, count: blogs.length, blogs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch blog articles.' });
  }
};

export const getPublicBlogBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const blog = await BlogPost.findOne({ slug, isPublished: true });
    if (!blog) {
      res.status(404).json({ success: false, message: 'Blog article not found.' });
      return;
    }
    res.json({ success: true, blog });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch blog article.' });
  }
};

export const getPublicFAQs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.query;
    const filter: any = { isPublished: true };
    if (category) filter.category = category;

    const faqs = await FAQ.find(filter).sort({ order: 1, createdAt: 1 });
    res.json({ success: true, faqs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch FAQs.' });
  }
};

export const getPublicStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [publishedProjects, verifiedReviews, totalServices] = await Promise.all([
      Project.countDocuments({ status: 'published' }),
      Review.countDocuments({ status: 'approved' }),
      Service.countDocuments({ isPublished: true }),
    ]);

    const reviews = await Review.find({ status: 'approved' }).select('rating');
    const avgRating =
      reviews.length > 0
        ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1))
        : 0;

    res.json({
      success: true,
      stats: {
        publishedProjects,
        verifiedReviews,
        totalServices,
        averageRating: avgRating,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch company metrics.' });
  }
};
