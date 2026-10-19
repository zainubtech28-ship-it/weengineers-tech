import { Router } from 'express';
import {
  getPublicSettings,
  getPublicServices,
  getPublicServiceBySlug,
  getPublicProjects,
  getPublicProjectBySlug,
  getPublicTeam,
  getPublicReviews,
  submitPublicReview,
  reportReview,
  submitPublicEnquiry,
  trackPublicEnquiry,
  getPublicBlogs,
  getPublicBlogBySlug,
  getPublicFAQs,
  getPublicStats,
} from '../controllers/publicController.js';
import { enquiryLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.get('/settings', getPublicSettings);
router.get('/services', getPublicServices);
router.get('/services/:slug', getPublicServiceBySlug);
router.get('/projects', getPublicProjects);
router.get('/projects/:slug', getPublicProjectBySlug);
router.get('/team', getPublicTeam);
router.get('/reviews', getPublicReviews);
router.post('/reviews', submitPublicReview);
router.post('/reviews/:id/report', reportReview);
router.post('/enquiries', enquiryLimiter, submitPublicEnquiry);
router.get('/enquiries/track/:referenceCode', trackPublicEnquiry);
router.get('/blog', getPublicBlogs);
router.get('/blog/:slug', getPublicBlogBySlug);
router.get('/faqs', getPublicFAQs);
router.get('/stats', getPublicStats);

export default router;
