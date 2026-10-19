import { Router } from 'express';
import {
  getAdminDashboardStats,
  getAllProjectsAdmin,
  createProject,
  updateProject,
  deleteProject,
  getAllServicesAdmin,
  createService,
  updateService,
  deleteService,
  getAllTeamAdmin,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getAllEnquiriesAdmin,
  updateEnquiryStatus,
  addEnquiryNote,
  exportEnquiriesCSV,
  getAllReviewsAdmin,
  moderateReview,
  deleteReview,
  getAllFAQsAdmin,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  getAllBlogsAdmin,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getSettingsAdmin,
  updateSettingsAdmin,
  getNotifications,
  markNotificationRead,
  getAuditLogs,
} from '../controllers/adminController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { adminOrFounder } from '../middleware/roleMiddleware.js';

const router = Router();

// All routes require authentication and admin or founder privilege
router.use(authenticate, adminOrFounder);

// Dashboard
router.get('/dashboard-stats', getAdminDashboardStats);

// Projects
router.get('/projects', getAllProjectsAdmin);
router.post('/projects', createProject);
router.put('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);

// Services
router.get('/services', getAllServicesAdmin);
router.post('/services', createService);
router.put('/services/:id', updateService);
router.delete('/services/:id', deleteService);

// Team Members
router.get('/team', getAllTeamAdmin);
router.post('/team', createTeamMember);
router.put('/team/:id', updateTeamMember);
router.delete('/team/:id', deleteTeamMember);

// Enquiries
router.get('/enquiries', getAllEnquiriesAdmin);
router.get('/enquiries/export', exportEnquiriesCSV);
router.patch('/enquiries/:id/status', updateEnquiryStatus);
router.post('/enquiries/:id/notes', addEnquiryNote);

// Reviews
router.get('/reviews', getAllReviewsAdmin);
router.patch('/reviews/:id/moderate', moderateReview);
router.delete('/reviews/:id', deleteReview);

// FAQs
router.get('/faqs', getAllFAQsAdmin);
router.post('/faqs', createFAQ);
router.put('/faqs/:id', updateFAQ);
router.delete('/faqs/:id', deleteFAQ);

// Blogs
router.get('/blogs', getAllBlogsAdmin);
router.post('/blogs', createBlogPost);
router.put('/blogs/:id', updateBlogPost);
router.delete('/blogs/:id', deleteBlogPost);

// Settings
router.get('/settings', getSettingsAdmin);
router.put('/settings', updateSettingsAdmin);

// Notifications
router.get('/notifications', getNotifications);
router.patch('/notifications/:id/read', markNotificationRead);

// Audit Logs
router.get('/audit-logs', getAuditLogs);

export default router;
