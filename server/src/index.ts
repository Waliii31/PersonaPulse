import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { connectDB } from './config/db';
import auditRoutes from './routes/audits';
import authRoutes from './routes/auth';
import contactRoutes from './routes/contact';
import { seedSandboxDatabase } from './scripts/seed';

const app = express();
const PORT = parseInt(process.env.PORT || '4000', 10);

// ── Security Headers & Middleware ───────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, curl)
      if (!origin) return callback(null, true);
      // Allow localhost or 127.0.0.1 for local development
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true);
      }
      // Allow any Vercel domain (*.vercel.app)
      if (origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }
      // Allow explicitly configured CORS_ORIGIN
      if (process.env.CORS_ORIGIN && (origin === process.env.CORS_ORIGIN || process.env.CORS_ORIGIN === '*')) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Root Endpoint ────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    name: 'PersonaPulse API Gateway',
    status: 'online',
    version: '1.0.0',
    message: 'PersonaPulse backend is live and operational.',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    endpoints: {
      root: '/',
      health: '/api/health',
      seed: '/api/seed',
      audits: '/api/audits',
      stripeAudit: '/api/audits/stripe-checkout-v4',
      notionAudit: '/api/audits/notion-pricing-2024',
      shopifyAudit: '/api/audits/shopify-admin-storefront',
      authDemo: '/api/auth/demo',
      contact: '/api/contact',
    },
  });
});

// ── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'PersonaPulse API Gateway',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ── Browser-Accessible Sandbox Seeder ────────────────────────────────────────
app.all('/api/seed', async (req, res) => {
  try {
    const force = req.query.force === 'true';
    const result = await seedSandboxDatabase(force);
    res.json({
      success: true,
      ...result,
      availableAudits: [
        '/api/audits/stripe-checkout-v4',
        '/api/audits/notion-pricing-2024',
        '/api/audits/shopify-admin-storefront',
      ],
    });
  } catch (err: any) {
    console.error('Seed endpoint error:', err);
    res.status(500).json({ success: false, error: err.message || 'Seeding failed' });
  }
});

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/audits', auditRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);

// ── 404 Handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// ── Global Error Handler ─────────────────────────────────────────────────────
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
);

// ── Bootstrap ────────────────────────────────────────────────────────────────
async function bootstrap(): Promise<void> {
  await connectDB();
  await seedSandboxDatabase();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 PersonaPulse API running on http://localhost:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('Fatal bootstrap error:', err);
  process.exit(1);
});

export default app;
