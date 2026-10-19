import { Router } from 'express';
import {
  getFounderExecutiveOverview,
  getAdministrators,
  createAdministrator,
  toggleAdminStatus,
  deleteAdministrator,
  getSystemHealthAndSettings,
  updateCompanyBrandingAndProfile,
  exportExecutiveReport,
} from '../controllers/founderController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { founderOnly } from '../middleware/roleMiddleware.js';

const router = Router();

// Strictly enforced Founder-Only access
router.use(authenticate, founderOnly);

router.get('/overview', getFounderExecutiveOverview);
router.get('/administrators', getAdministrators);
router.post('/administrators', createAdministrator);
router.patch('/administrators/:id/status', toggleAdminStatus);
router.delete('/administrators/:id', deleteAdministrator);
router.get('/system-health', getSystemHealthAndSettings);
router.put('/company-branding', updateCompanyBrandingAndProfile);
router.get('/reports/export', exportExecutiveReport);

export default router;
