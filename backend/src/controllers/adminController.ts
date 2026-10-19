import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { Project } from '../models/Project.js';
import { Service } from '../models/Service.js';
import { TeamMember } from '../models/TeamMember.js';
import { Enquiry } from '../models/Enquiry.js';
import { Review } from '../models/Review.js';
import { FAQ } from '../models/FAQ.js';
import { BlogPost } from '../models/BlogPost.js';
import { CompanySettings } from '../models/CompanySettings.js';
import { Notification } from '../models/Notification.js';
import { AuditLog } from '../models/AuditLog.js';
import { recordAuditLog } from '../utils/audit.js';

// Dashboard Overview
export const getAdminDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [
      totalProjects,
      publishedProjects,
      draftProjects,
      archivedProjects,
      totalEnquiries,
      newEnquiries,
      pendingReviews,
      unreadNotifications,
      recentEnquiries,
      recentProjects,
    ] = await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ status: 'published' }),
      Project.countDocuments({ status: 'draft' }),
      Project.countDocuments({ status: 'archived' }),
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ status: 'New' }),
      Review.countDocuments({ status: 'pending' }),
      Notification.countDocuments({ isRead: false }),
      Enquiry.find().sort({ createdAt: -1 }).limit(5),
      Project.find().sort({ updatedAt: -1 }).limit(5),
    ]);

    // Enquiries breakdown by status
    const enquiriesByStatus = await Enquiry.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Format status counts nicely
    const statusMap: Record<string, number> = {
      New: 0,
      Contacted: 0,
      Qualified: 0,
      'Proposal Sent': 0,
      'In Progress': 0,
      Completed: 0,
      Rejected: 0,
    };
    enquiriesByStatus.forEach((item) => {
      if (item._id) statusMap[item._id] = item.count;
    });

    res.json({
      success: true,
      stats: {
        projects: {
          total: totalProjects,
          published: publishedProjects,
          draft: draftProjects,
          archived: archivedProjects,
        },
        enquiries: {
          total: totalEnquiries,
          new: newEnquiries,
          byStatus: statusMap,
        },
        reviews: {
          pending: pendingReviews,
        },
        notifications: {
          unread: unreadNotifications,
        },
        recentEnquiries,
        recentProjects,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve dashboard metrics.' });
  }
};

// --- PROJECTS CRUD ---
export const getAllProjectsAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, category, search } = req.query;
    const filter: any = {};
    if (status && status !== 'all') filter.status = status;
    if (category && category !== 'all') filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const projects = await Project.find(filter).sort({ order: 1, updatedAt: -1 });
    res.json({ success: true, count: projects.length, projects });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch projects.' });
  }
};

export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const projectData = req.body;
    if (!projectData.title || !projectData.category || !projectData.description || !projectData.thumbnailUrl) {
      res.status(400).json({
        success: false,
        message: 'Title, category, description, and thumbnail image URL are required.',
      });
      return;
    }

    // Auto generate unique slug if not provided
    if (!projectData.slug) {
      projectData.slug = projectData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    const project = await Project.create(projectData);

    await recordAuditLog({
      userId: req.user!._id,
      userEmail: req.user!.email,
      userRole: req.user!.role,
      action: 'PROJECT_CREATED',
      module: 'PROJECTS',
      details: { projectId: project._id, title: project.title },
      req,
    });

    res.status(201).json({ success: true, message: 'Project created successfully.', project });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to create project.' });
  }
};

export const updateProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const project = await Project.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found.' });
      return;
    }

    await recordAuditLog({
      userId: req.user!._id,
      userEmail: req.user!.email,
      userRole: req.user!.role,
      action: 'PROJECT_UPDATED',
      module: 'PROJECTS',
      details: { projectId: project._id, title: project.title },
      req,
    });

    res.json({ success: true, message: 'Project updated successfully.', project });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update project.' });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found.' });
      return;
    }

    await recordAuditLog({
      userId: req.user!._id,
      userEmail: req.user!.email,
      userRole: req.user!.role,
      action: 'PROJECT_DELETED',
      module: 'PROJECTS',
      details: { projectId: id, title: project.title },
      req,
    });

    res.json({ success: true, message: 'Project deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to delete project.' });
  }
};

// --- SERVICES CRUD ---
export const getAllServicesAdmin = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const services = await Service.find().sort({ order: 1, createdAt: 1 });
    res.json({ success: true, count: services.length, services });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch services.' });
  }
};

export const createService = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const serviceData = req.body;
    if (!serviceData.title || !serviceData.shortDescription || !serviceData.fullDescription) {
      res.status(400).json({
        success: false,
        message: 'Title, short description, and full description are required.',
      });
      return;
    }

    if (!serviceData.slug) {
      serviceData.slug = serviceData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    const service = await Service.create(serviceData);

    await recordAuditLog({
      userId: req.user!._id,
      userEmail: req.user!.email,
      userRole: req.user!.role,
      action: 'SERVICE_CREATED',
      module: 'SERVICES',
      details: { serviceId: service._id, title: service.title },
      req,
    });

    res.status(201).json({ success: true, message: 'Service created successfully.', service });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to create service.' });
  }
};

export const updateService = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const service = await Service.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!service) {
      res.status(404).json({ success: false, message: 'Service not found.' });
      return;
    }

    await recordAuditLog({
      userId: req.user!._id,
      userEmail: req.user!.email,
      userRole: req.user!.role,
      action: 'SERVICE_UPDATED',
      module: 'SERVICES',
      details: { serviceId: service._id, title: service.title },
      req,
    });

    res.json({ success: true, message: 'Service updated successfully.', service });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update service.' });
  }
};

export const deleteService = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const service = await Service.findByIdAndDelete(id);
    if (!service) {
      res.status(404).json({ success: false, message: 'Service not found.' });
      return;
    }

    await recordAuditLog({
      userId: req.user!._id,
      userEmail: req.user!.email,
      userRole: req.user!.role,
      action: 'SERVICE_DELETED',
      module: 'SERVICES',
      details: { serviceId: id, title: service.title },
      req,
    });

    res.json({ success: true, message: 'Service deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to delete service.' });
  }
};

// --- TEAM MANAGEMENT ---
export const getAllTeamAdmin = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const team = await TeamMember.find().sort({ order: 1, createdAt: 1 });
    res.json({ success: true, count: team.length, team });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch team members.' });
  }
};

export const createTeamMember = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const memberData = req.body;
    if (!memberData.name) {
      res.status(400).json({
        success: false,
        message: 'Team member name is required.',
      });
      return;
    }

    if (!memberData.designation) {
      memberData.designation = 'B.Tech Information Technology — 3rd Year';
    }

    // Regular admin cannot mark anyone as a founder unless user is a founder
    if (memberData.isFounder && req.user!.role !== 'founder') {
      res.status(403).json({
        success: false,
        message: 'Only the founder can assign executive founder designations.',
      });
      return;
    }

    const member = await TeamMember.create(memberData);

    await recordAuditLog({
      userId: req.user!._id,
      userEmail: req.user!.email,
      userRole: req.user!.role,
      action: 'TEAM_MEMBER_CREATED',
      module: 'TEAM',
      details: { memberId: member._id, name: member.name },
      req,
    });

    res.status(201).json({ success: true, message: 'Team profile created successfully.', member });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to create team member.' });
  }
};

export const updateTeamMember = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const memberData = req.body;

    if (memberData.isFounder && req.user!.role !== 'founder') {
      delete memberData.isFounder; // Prevent unauthorized elevation
    }

    const member = await TeamMember.findByIdAndUpdate(id, memberData, { new: true, runValidators: true });
    if (!member) {
      res.status(404).json({ success: false, message: 'Team member not found.' });
      return;
    }

    await recordAuditLog({
      userId: req.user!._id,
      userEmail: req.user!.email,
      userRole: req.user!.role,
      action: 'TEAM_MEMBER_UPDATED',
      module: 'TEAM',
      details: { memberId: member._id, name: member.name },
      req,
    });

    res.json({ success: true, message: 'Team profile updated successfully.', member });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update team member.' });
  }
};

export const deleteTeamMember = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const member = await TeamMember.findById(id);
    if (!member) {
      res.status(404).json({ success: false, message: 'Team member not found.' });
      return;
    }

    if (member.isFounder && req.user!.role !== 'founder') {
      res.status(403).json({
        success: false,
        message: 'Ordinary administrators cannot remove founder profiles.',
      });
      return;
    }

    await TeamMember.findByIdAndDelete(id);

    await recordAuditLog({
      userId: req.user!._id,
      userEmail: req.user!.email,
      userRole: req.user!.role,
      action: 'TEAM_MEMBER_DELETED',
      module: 'TEAM',
      details: { memberId: id, name: member.name },
      req,
    });

    res.json({ success: true, message: 'Team member deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to delete team member.' });
  }
};

// --- ENQUIRY MANAGEMENT ---
export const getAllEnquiriesAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const filter: any = {};
    if (status && status !== 'all') filter.status = status;
    if (search) {
      filter.$or = [
        { referenceCode: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [enquiries, total] = await Promise.all([
      Enquiry.find(filter)
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Enquiry.countDocuments(filter),
    ]);

    res.json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      enquiries,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch enquiries.' });
  }
};

export const updateEnquiryStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const validStatuses = [
      'New',
      'Contacted',
      'Qualified',
      'Proposal Sent',
      'In Progress',
      'Completed',
      'Rejected',
    ];

    if (!validStatuses.includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid status provided.' });
      return;
    }

    const enquiry = await Enquiry.findById(id);
    if (!enquiry) {
      res.status(404).json({ success: false, message: 'Enquiry not found.' });
      return;
    }

    const previousStatus = enquiry.status;
    enquiry.status = status;
    enquiry.history.push({
      status,
      changedBy: `${req.user!.name} (${req.user!.role})`,
      changedAt: new Date(),
      note: note || `Status updated from ${previousStatus} to ${status}.`,
    });

    await enquiry.save();

    await recordAuditLog({
      userId: req.user!._id,
      userEmail: req.user!.email,
      userRole: req.user!.role,
      action: 'ENQUIRY_STATUS_UPDATED',
      module: 'ENQUIRIES',
      details: { enquiryId: id, reference: enquiry.referenceCode, from: previousStatus, to: status },
      req,
    });

    res.json({ success: true, message: 'Enquiry status updated successfully.', enquiry });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update enquiry status.' });
  }
};

export const addEnquiryNote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { note } = req.body;

    if (!note || !note.trim()) {
      res.status(400).json({ success: false, message: 'Note text is required.' });
      return;
    }

    const enquiry = await Enquiry.findById(id);
    if (!enquiry) {
      res.status(404).json({ success: false, message: 'Enquiry not found.' });
      return;
    }

    enquiry.internalNotes.push({
      note: note.trim(),
      authorName: req.user!.name,
      authorEmail: req.user!.email,
      createdAt: new Date(),
    });

    await enquiry.save();

    res.json({ success: true, message: 'Internal note recorded.', enquiry });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to add note.' });
  }
};

export const exportEnquiriesCSV = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });

    let csv =
      'ReferenceCode,FullName,Email,Phone,CompanyName,Service,Budget,Timeline,Status,CreatedAt\n';
    enquiries.forEach((e) => {
      csv += `"${e.referenceCode}","${e.fullName.replace(/"/g, '""')}","${e.email}","${e.phone || ''}","${(e.companyName || '').replace(/"/g, '""')}","${e.service}","${e.budget || ''}","${e.timeline || ''}","${e.status}","${e.createdAt.toISOString()}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="weengineers_enquiries.csv"');
    res.status(200).send(csv);
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to export enquiries.' });
  }
};

// --- REVIEW MODERATION ---
export const getAllReviewsAdmin = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const reviews = await Review.find()
      .populate('projectId', 'title slug')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: reviews.length, reviews });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch reviews.' });
  }
};

export const moderateReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, note, isVerified } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      res.status(400).json({ success: false, message: 'Valid status (pending, approved, rejected) is required.' });
      return;
    }

    const review = await Review.findById(id);
    if (!review) {
      res.status(404).json({ success: false, message: 'Review not found.' });
      return;
    }

    review.status = status;
    if (typeof isVerified === 'boolean') review.isVerified = isVerified;
    if (status === 'approved') review.isFlagged = false; // clear flag if approved

    review.moderationHistory.push({
      status,
      moderatedBy: `${req.user!.name} (${req.user!.role})`,
      moderatedAt: new Date(),
      note,
    });

    await review.save();

    await recordAuditLog({
      userId: req.user!._id,
      userEmail: req.user!.email,
      userRole: req.user!.role,
      action: 'REVIEW_MODERATED',
      module: 'REVIEWS',
      details: { reviewId: id, status, clientName: review.clientName },
      req,
    });

    res.json({ success: true, message: `Review marked as ${status}.`, review });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to moderate review.' });
  }
};

export const deleteReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      res.status(404).json({ success: false, message: 'Review not found.' });
      return;
    }

    await recordAuditLog({
      userId: req.user!._id,
      userEmail: req.user!.email,
      userRole: req.user!.role,
      action: 'REVIEW_DELETED',
      module: 'REVIEWS',
      details: { reviewId: id, clientName: review.clientName },
      req,
    });

    res.json({ success: true, message: 'Review deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to delete review.' });
  }
};

// --- CONTENT MANAGEMENT (FAQs & Blog) ---
export const getAllFAQsAdmin = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const faqs = await FAQ.find().sort({ order: 1, createdAt: 1 });
    res.json({ success: true, count: faqs.length, faqs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch FAQs.' });
  }
};

export const createFAQ = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { question, answer, category, order, isPublished } = req.body;
    if (!question || !answer) {
      res.status(400).json({ success: false, message: 'Question and answer are required.' });
      return;
    }

    const faq = await FAQ.create({ question, answer, category, order, isPublished });
    res.status(201).json({ success: true, message: 'FAQ created successfully.', faq });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to create FAQ.' });
  }
};

export const updateFAQ = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const faq = await FAQ.findByIdAndUpdate(id, req.body, { new: true });
    if (!faq) {
      res.status(404).json({ success: false, message: 'FAQ not found.' });
      return;
    }
    res.json({ success: true, message: 'FAQ updated successfully.', faq });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update FAQ.' });
  }
};

export const deleteFAQ = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await FAQ.findByIdAndDelete(id);
    res.json({ success: true, message: 'FAQ deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to delete FAQ.' });
  }
};

// Blog Posts Admin
export const getAllBlogsAdmin = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const blogs = await BlogPost.find().sort({ createdAt: -1 });
    res.json({ success: true, count: blogs.length, blogs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch blog posts.' });
  }
};

export const createBlogPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const blogData = req.body;
    if (!blogData.title || !blogData.excerpt || !blogData.content) {
      res.status(400).json({ success: false, message: 'Title, excerpt, and content are required.' });
      return;
    }

    if (!blogData.slug) {
      blogData.slug = blogData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    const blog = await BlogPost.create(blogData);
    res.status(201).json({ success: true, message: 'Blog post published successfully.', blog });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to create blog post.' });
  }
};

export const updateBlogPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const blog = await BlogPost.findByIdAndUpdate(id, req.body, { new: true });
    if (!blog) {
      res.status(404).json({ success: false, message: 'Blog post not found.' });
      return;
    }
    res.json({ success: true, message: 'Blog post updated successfully.', blog });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update blog post.' });
  }
};

export const deleteBlogPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await BlogPost.findByIdAndDelete(id);
    res.json({ success: true, message: 'Blog post deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to delete blog post.' });
  }
};

// Company Settings (Admin can view and update non-critical website content)
export const getSettingsAdmin = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    let settings = await CompanySettings.findOne();
    if (!settings) settings = await CompanySettings.create({});
    res.json({ success: true, settings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch settings.' });
  }
};

export const updateSettingsAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let settings = await CompanySettings.findOne();
    if (!settings) {
      settings = await CompanySettings.create(req.body);
    } else {
      settings = await CompanySettings.findByIdAndUpdate(settings._id, req.body, { new: true });
    }

    await recordAuditLog({
      userId: req.user!._id,
      userEmail: req.user!.email,
      userRole: req.user!.role,
      action: 'SETTINGS_UPDATED',
      module: 'SETTINGS',
      req,
    });

    res.json({ success: true, message: 'Company settings updated successfully.', settings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update settings.' });
  }
};

// Notifications
export const getNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const notifications = await Notification.find({
      $or: [{ targetRole: 'all' }, { targetRole: req.user!.role }],
    })
      .sort({ createdAt: -1 })
      .limit(30);

    const unreadCount = await Notification.countDocuments({
      isRead: false,
      $or: [{ targetRole: 'all' }, { targetRole: req.user!.role }],
    });

    res.json({ success: true, unreadCount, notifications });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch notifications.' });
  }
};

export const markNotificationRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (id === 'all') {
      await Notification.updateMany({ isRead: false }, { isRead: true });
      res.json({ success: true, message: 'All notifications marked as read.' });
      return;
    }

    await Notification.findByIdAndUpdate(id, { isRead: true });
    res.json({ success: true, message: 'Notification marked as read.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update notification.' });
  }
};

// Audit Logs (Accessible to Admin & Founder)
export const getAuditLogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { module, action, search, page = 1, limit = 50 } = req.query;
    const filter: any = {};
    if (module && module !== 'all') filter.module = module;
    if (action && action !== 'all') filter.action = action;
    if (search) {
      filter.$or = [
        { userEmail: { $regex: search, $options: 'i' } },
        { action: { $regex: search, $options: 'i' } },
        { module: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 50;
    const skip = (pageNum - 1) * limitNum;

    const [logs, total] = await Promise.all([
      AuditLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      AuditLog.countDocuments(filter),
    ]);

    res.json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      logs,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch audit logs.' });
  }
};
