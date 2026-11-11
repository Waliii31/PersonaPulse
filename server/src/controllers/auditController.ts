import { Request, Response } from 'express';
import { AuditReport } from '../models/AuditReport';
import { validateSafeUrl } from '../utils/urlValidator';

const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://localhost:8000';

/**
 * GET /api/audits
 * Returns all sandbox (pre-loaded) audit reports for the landing page.
 */
export async function listSandboxAudits(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const audits = await AuditReport.find({ isSandbox: true })
      .select('url slug scores cachedAt isSandbox domSnapshot.title')
      .lean();

    res.json({
      success: true,
      count: audits.length,
      data: audits,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch audits' });
  }
}

/**
 * GET /api/audits/:slug
 * Returns a single full audit report by its URL slug.
 */
export async function getAuditBySlug(
  req: Request,
  res: Response
): Promise<void> {
  try {
    let audit = await AuditReport.findOne({ slug: req.params.slug }).lean();

    if (!audit) {
      // Alias mapping for sandbox variants
      const slugAliases: Record<string, string> = {
        'stripe-checkout-v4': 'stripe-com-audit',
        'notion-pricing-2024': 'notion-so-audit',
        'shopify-admin-storefront': 'shopify-com-audit',
      };
      const mapped = slugAliases[req.params.slug];
      if (mapped) {
        audit = await AuditReport.findOne({ slug: mapped }).lean();
      }
    }

    if (!audit) {
      res.status(404).json({ success: false, error: 'Audit not found' });
      return;
    }

    // Ensure live audit has a real screenshot source if base64 is missing
    if (!audit.isSandbox && (!audit.domSnapshot?.screenshotBase64 || !audit.domSnapshot.screenshotBase64.startsWith('data:image/')) && audit.url) {
      if (!audit.domSnapshot) {
        (audit as any).domSnapshot = { title: audit.url, viewport: { width: 1280, height: 800 }, interactiveElements: [] };
      }
      audit.domSnapshot.screenshotBase64 = `https://image.thum.io/get/width/1280/crop/800/noanimate/${audit.url}`;
    }

    res.json({ success: true, data: audit });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch audit' });
  }
}

/**
 * POST /api/audits/scan
 * Body: { url: string }
 *
 * 1. Normalises the URL.
 * 2. Checks MongoDB for a cached audit < 7 days old → returns immediately with `cached: true`.
 * 3. On cache miss → calls FastAPI AI Engine `POST /analyze-url`, saves report to MongoDB, and returns `cached: false`.
 *
 * Rate-limited to 2 live requests per 24 hours per IP.
 */
export async function scanUrl(req: Request, res: Response): Promise<void> {
  const { url } = req.body as { url?: string };

  if (!url || typeof url !== 'string') {
    res.status(400).json({ success: false, error: 'url is required in body' });
    return;
  }

  // Normalise and security validate URL (SSRF prevention)
  const validation = validateSafeUrl(url);
  if (!validation.isValid || !validation.normalized) {
    res.status(400).json({ success: false, error: validation.error || 'Invalid URL format' });
    return;
  }
  const normalised = validation.normalized;

  // ── Cache check (7-day TTL) ──────────────────────────────────────────────
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
  const cutoff = new Date(Date.now() - SEVEN_DAYS_MS);

  try {
    const cached = await AuditReport.findOne({
      url: normalised,
      cachedAt: { $gte: cutoff },
    }).lean();

    if (cached) {
      res.json({
        success: true,
        cached: true,
        data: cached,
      });
      return;
    }

    // ── Cache Miss → Call FastAPI AI Engine ────────────────────────────────
    console.log(`🤖 Cache miss for ${normalised}. Triggering AI Engine analysis at ${AI_ENGINE_URL}/analyze-url...`);

    const aiResponse = await fetch(`${AI_ENGINE_URL}/analyze-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: normalised }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error(`AI Engine returned ${aiResponse.status}:`, errText);
      res.status(502).json({
        success: false,
        error: `AI Engine analysis failed with status ${aiResponse.status}: ${errText}`,
      });
      return;
    }

    const aiData: any = await aiResponse.json();

    // Ensure live audit has a real screenshot attached
    if (!aiData.domSnapshot?.screenshotBase64 || !aiData.domSnapshot.screenshotBase64.startsWith('data:image/')) {
      try {
        const screenshotResp = await fetch(`https://image.thum.io/get/width/1280/crop/800/noanimate/${normalised}`);
        if (screenshotResp.ok) {
          const buffer = await screenshotResp.arrayBuffer();
          if (buffer.byteLength > 3000) {
            aiData.domSnapshot = aiData.domSnapshot || {};
            aiData.domSnapshot.screenshotBase64 = `data:image/png;base64,${Buffer.from(buffer).toString('base64')}`;
          }
        }
      } catch (err) {
        console.warn('Real screenshot capture fallback failed:', err);
      }
    }

    // Ensure unique slug
    let finalSlug = aiData.slug || 'custom-audit';
    const existingSlug = await AuditReport.findOne({ slug: finalSlug });
    if (existingSlug && existingSlug.url !== normalised) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    // Save or update newly generated audit into MongoDB
    const savedAudit = await AuditReport.findOneAndUpdate(
      { url: normalised },
      {
        url: normalised,
        slug: finalSlug,
        cachedAt: new Date(),
        isSandbox: false,
        scores: aiData.scores,
        domSnapshot: aiData.domSnapshot,
        personaTraces: aiData.personaTraces,
        remediations: aiData.remediations,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`✅ Saved new live audit for ${normalised} (slug: ${finalSlug}) to MongoDB.`);

    res.status(201).json({
      success: true,
      cached: false,
      data: savedAudit,
    });
  } catch (err: any) {
    console.error('Scan processing error:', err);
    if (err.cause?.code === 'ECONNREFUSED' || err.message?.includes('fetch failed')) {
      res.status(503).json({
        success: false,
        error: `Cannot reach AI Engine at ${AI_ENGINE_URL}. Ensure the FastAPI service is running.`,
      });
      return;
    }
    res.status(500).json({ success: false, error: 'Internal server error while processing scan' });
  }
}
