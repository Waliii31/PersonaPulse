import rateLimit from 'express-rate-limit';
import { AuditReport } from '../models/AuditReport';

/**
 * Rate limiter for the POST /api/audits/scan endpoint.
 *
 * Core rule from PRD:
 * - "Cached results are always free."
 * - Only genuine LIVE scans count against the 24-hour IP quota.
 */
export const scanRateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '86400000', 10), // 24h default
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '20', 10),
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const forwarded = req.headers['x-forwarded-for'];
    const ip =
      (Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0]) ??
      req.socket.remoteAddress ??
      'unknown';
    return ip.trim();
  },
  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      error:
        'Rate limit exceeded. You may submit up to 2 live scan requests per 24 hours. Cached results are always free.',
      retryAfter: res.getHeader('RateLimit-Reset'),
    });
  },
  skip: async (req) => {
    const rawUrl = req.body?.url;
    if (!rawUrl || typeof rawUrl !== 'string') {
      return true; // Let controller handle validation error without consuming rate limit
    }

    try {
      const parsed = new URL(rawUrl.trim().startsWith('http') ? rawUrl.trim() : `https://${rawUrl.trim()}`);
      const normalised = `${parsed.protocol}//${parsed.hostname}${parsed.pathname.replace(/\/$/, '')}`;

      const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
      const cutoff = new Date(Date.now() - SEVEN_DAYS_MS);

      // If already cached within 7 days, this request is 100% free and does not count!
      const cached = await AuditReport.findOne({
        url: normalised,
        cachedAt: { $gte: cutoff },
      }).select('_id').lean();

      if (cached) {
        return true; // SKIP rate limiting!
      }
    } catch {
      return true; // Let controller return 400 for bad URL format
    }

    return false; // Live scan miss: consumes 1 rate limit point
  },
});

/**
 * Rate limiter for POST /api/auth/login to protect against brute-force attacks.
 * 15-minute window, max 10 failed/repeated login attempts.
 */
export const authLoginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many authentication attempts. Please try again after 15 minutes.',
  },
});

/**
 * Rate limiter for POST /api/contact to prevent automated spam bot submissions.
 * 1-hour window, max 15 inquiries per IP.
 */
export const contactRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many contact inquiries dispatched. Please try again in an hour.',
  },
});
