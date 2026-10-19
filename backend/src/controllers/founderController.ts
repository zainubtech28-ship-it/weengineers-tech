import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { User } from '../models/User.js';
import { Project } from '../models/Project.js';
import { Service } from '../models/Service.js';
import { Enquiry } from '../models/Enquiry.js';
import { Review } from '../models/Review.js';
import { CompanySettings } from '../models/CompanySettings.js';
import { AuditLog } from '../models/AuditLog.js';
import { recordAuditLog } from '../utils/audit.js';

// Executive High-Level Analytics
export const getFounderExecutiveOverview = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [
      totalProjects,
      publishedProjects,
      draftProjects,
      totalEnquiries,
      newEnquiries,
      completedEnquiries,
      inProgressEnquiries,
      totalAdmins,
      approvedReviews,
      recentAuditLogs,
      recentEnquiries,
    ] = await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ status: 'published' }),
      Project.countDocuments({ status: 'draft' }),
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ status: 'New' }),
      Enquiry.countDocuments({ status: 'Completed' }),
      Enquiry.countDocuments({ status: 'In Progress' }),
      User.countDocuments({ role: 'admin' }),
      Review.countDocuments({ status: 'approved' }),
      AuditLog.find().sort({ createdAt: -1 }).limit(10),
      Enquiry.find().sort({ createdAt: -1 }).limit(6),
    ]);

    // Conversion rate: (completed + in progress) / total enquiries
    const conversionRate =
      totalEnquiries > 0
        ? Number((((completedEnquiries + inProgressEnquiries) / totalEnquiries) * 100).toFixed(1))
        : 0;

    // Service popularity based on enquiries
    const servicePopularity = await Enquiry.aggregate([
      { $group: { _id: '$service', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]);

    // Monthly Enquiry Trends (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyTrendsRaw = await Enquiry.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyTrends = monthlyTrendsRaw.map((item) => ({
      name: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      enquiries: item.count,
    }));

    // Average rating
    const reviews = await Review.find({ status: 'approved' }).select('rating');
    const averageRating =
      reviews.length > 0
        ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1))
        : 0;

    res.json({
      success: true,
      executive: {
        totalProjects,
        publishedProjects,
        draftProjects,
        totalEnquiries,
        newEnquiries,
        conversionRate,
        totalAdmins,
        approvedReviews,
        averageRating,
        servicePopularity: servicePopularity.map((s) => ({ name: s._id || 'Unspecified', count: s.count })),
        monthlyTrends,
        recentAuditLogs,
        recentEnquiries,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve executive overview.' });
  }
};

// Administrator Governance: Manage Admin Accounts
export const getAdministrators = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const admins = await User.find({ role: 'admin' }).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: admins.length, admins });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch administrators.' });
  }
};

export const createAdministrator = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone, permissions } = req.body;

    if (!name || !email || !password || password.length < 8) {
      res.status(400).json({
        success: false,
        message: 'Name, email, and password (minimum 8 characters) are required.',
      });
      return;
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      res.status(400).json({ success: false, message: 'A user with this email already exists.' });
      return;
    }

    const admin = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: 'admin',
      status: 'active',
      phone: phone ? phone.trim() : undefined,
      permissions: permissions && permissions.length ? permissions : ['projects', 'services', 'enquiries', 'reviews', 'content'],
    });

    await recordAuditLog({
      userId: req.user!._id,
      userEmail: req.user!.email,
      userRole: req.user!.role,
      action: 'ADMINISTRATOR_CREATED',
      module: 'GOVERNANCE',
      details: { createdAdminEmail: admin.email, createdAdminId: admin._id },
      req,
    });

    res.status(201).json({
      success: true,
      message: 'Administrator account provisioned successfully.',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        status: admin.status,
        permissions: admin.permissions,
        createdAt: admin.createdAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to create administrator.' });
  }
};

export const toggleAdminStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'inactive'].includes(status)) {
      res.status(400).json({ success: false, message: 'Status must be active or inactive.' });
      return;
    }

    const targetUser = await User.findById(id);
    if (!targetUser) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    // Safety: Cannot deactivate or demote a founder
    if (targetUser.role === 'founder') {
      res.status(403).json({
        success: false,
        message: 'Founder accounts cannot be deactivated.',
      });
      return;
    }

    targetUser.status = status;
    await targetUser.save();

    await recordAuditLog({
      userId: req.user!._id,
      userEmail: req.user!.email,
      userRole: req.user!.role,
      action: `ADMIN_${status.toUpperCase()}`,
      module: 'GOVERNANCE',
      details: { targetUserId: id, targetEmail: targetUser.email, newStatus: status },
      req,
    });

    res.json({
      success: true,
      message: `Administrator account marked as ${status}.`,
      admin: { id: targetUser._id, status: targetUser.status },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update administrator status.' });
  }
};

export const deleteAdministrator = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const targetUser = await User.findById(id);

    if (!targetUser) {
      res.status(404).json({ success: false, message: 'Administrator not found.' });
      return;
    }

    if (targetUser.role === 'founder') {
      res.status(403).json({ success: false, message: 'Founder accounts cannot be deleted.' });
      return;
    }

    await User.findByIdAndDelete(id);

    await recordAuditLog({
      userId: req.user!._id,
      userEmail: req.user!.email,
      userRole: req.user!.role,
      action: 'ADMINISTRATOR_DELETED',
      module: 'GOVERNANCE',
      details: { deletedEmail: targetUser.email, deletedId: id },
      req,
    });

    res.json({ success: true, message: 'Administrator account deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to delete administrator.' });
  }
};

// System Settings & Health (Exclusive to Founder)
export const getSystemHealthAndSettings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let settings = await CompanySettings.findOne();
    if (!settings) settings = await CompanySettings.create({});

    const dbState = mongoose.connection.readyState;
    const dbStatusMap: Record<number, string> = {
      0: 'Disconnected',
      1: 'Connected',
      2: 'Connecting',
      3: 'Disconnecting',
    };

    res.json({
      success: true,
      settings,
      systemHealth: {
        databaseStatus: dbStatusMap[dbState] || 'Unknown',
        uptimeSeconds: Math.floor(process.uptime()),
        memoryUsageMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        nodeVersion: process.version,
        environment: process.env.NODE_ENV || 'development',
        serverTime: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch system settings and health.' });
  }
};

export const updateCompanyBrandingAndProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let settings = await CompanySettings.findOne();
    if (!settings) {
      settings = await CompanySettings.create(req.body);
    } else {
      settings = await CompanySettings.findByIdAndUpdate(settings._id, req.body, {
        new: true,
        runValidators: true,
      });
    }

    await recordAuditLog({
      userId: req.user!._id,
      userEmail: req.user!.email,
      userRole: req.user!.role,
      action: 'FOUNDER_COMPANY_PROFILE_UPDATED',
      module: 'SETTINGS',
      details: { companyName: settings?.companyName, tagline: settings?.tagline },
      req,
    });

    res.json({ success: true, message: 'Company profile and branding saved.', settings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update company branding.' });
  }
};

// Executive Reports Export
export const exportExecutiveReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { type } = req.query; // 'enquiries' | 'projects' | 'audits'

    if (type === 'projects') {
      const projects = await Project.find().sort({ createdAt: -1 });
      let csv = 'Title,Category,Status,IsFeatured,Technologies,LiveUrl,CreatedAt\n';
      projects.forEach((p) => {
        csv += `"${p.title.replace(/"/g, '""')}","${p.category}","${p.status}","${p.isFeatured}","${(p.technologies || []).join('; ')}","${p.liveUrl || ''}","${p.createdAt.toISOString()}"\n`;
      });
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="weengineers_projects_report.csv"');
      res.status(200).send(csv);
      return;
    }

    if (type === 'audits') {
      const audits = await AuditLog.find().sort({ createdAt: -1 }).limit(500);
      let csv = 'Timestamp,UserEmail,UserRole,Action,Module,IPAddress\n';
      audits.forEach((a) => {
        csv += `"${a.createdAt.toISOString()}","${a.userEmail}","${a.userRole}","${a.action}","${a.module}","${a.ipAddress || ''}"\n`;
      });
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="weengineers_audit_report.csv"');
      res.status(200).send(csv);
      return;
    }

    // Default: comprehensive business enquiries report
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    let csv =
      'ReferenceCode,ClientName,Email,Phone,CompanyName,Service,Budget,Timeline,Status,CreatedAt\n';
    enquiries.forEach((e) => {
      csv += `"${e.referenceCode}","${e.fullName.replace(/"/g, '""')}","${e.email}","${e.phone || ''}","${(e.companyName || '').replace(/"/g, '""')}","${e.service}","${e.budget || ''}","${e.timeline || ''}","${e.status}","${e.createdAt.toISOString()}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="weengineers_business_enquiries_report.csv"');
    res.status(200).send(csv);
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to generate executive report.' });
  }
};
