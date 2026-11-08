import { Router } from 'express';
import {
  listSandboxAudits,
  getAuditBySlug,
  scanUrl,
} from '../controllers/auditController';
import { scanRateLimiter } from '../middleware/rateLimiter';

const router = Router();

/** GET /api/audits — list all sandbox reports */
router.get('/', listSandboxAudits);

/** POST /api/audits/scan — submit a URL for auditing (cache-first) */
router.post('/scan', scanRateLimiter, scanUrl);

/** GET /api/audits/:slug — fetch a single report (keep last, avoids intercepting "scan") */
router.get('/:slug', getAuditBySlug);

export default router;
