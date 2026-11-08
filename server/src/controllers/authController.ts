import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { AuthRequest } from '../middleware/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'personapulse_super_secret_jwt_key_2026';
const JWT_EXPIRES_IN = '7d';

const AVATAR_COLORS = ['#E53E00', '#2563EB', '#8B5CF6', '#EC4899', '#F59E0B', '#111111'];

function signToken(user: IUser): string {
  return jwt.sign(
    { userId: user._id.toString(), email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

function sanitizeUser(user: IUser) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    avatarColor: user.avatarColor,
    role: user.role,
    scansRemaining: user.scansRemaining,
    savedAudits: user.savedAudits,
    customPersonas: user.customPersonas,
  };
}

/**
 * POST /api/auth/register
 */
export async function register(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, error: 'Name, email, and password are required' });
      return;
    }

    if (typeof password !== 'string' || password.length < 6) {
      res.status(400).json({ success: false, error: 'Password must be at least 6 characters long' });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      res.status(409).json({ success: false, error: 'An account with this email already exists' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const avatarColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      avatarColor,
      role: 'pro',
      scansRemaining: 2,
      savedAudits: [
        {
          slug: 'stripe-checkout-v4',
          url: 'https://stripe.com/checkout',
          title: 'Stripe Checkout — Multi-Currency Payment Flow',
          overallGrade: 'B+',
          usability: 88,
          savedAt: new Date(),
        },
      ],
      customPersonas: [
        {
          name: 'Maya Chen (Initial Setup)',
          role: 'Impatient Mobile Buyer (Gen Z / TikTok Era)',
          viewportSize: 'iPhone 15 Pro (393x852)',
          focusArea: 'Checkout velocity, micro-friction, thumb zone reachability',
          color: '#EC4899',
          createdAt: new Date(),
        },
      ],
    });

    const token = signToken(user);
    res.status(201).json({
      success: true,
      token,
      user: sanitizeUser(user),
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, error: err.message || 'Server error during registration' });
  }
}

/**
 * POST /api/auth/login
 */
export async function login(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, error: 'Email and password are required' });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      res.status(401).json({ success: false, error: 'Invalid email or password' });
      return;
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      res.status(401).json({ success: false, error: 'Invalid email or password' });
      return;
    }

    const token = signToken(user);
    res.json({
      success: true,
      token,
      user: sanitizeUser(user),
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: err.message || 'Server error during login' });
  }
}

/**
 * POST /api/auth/demo
 * 1-Click Instant Recruiter Demo Login
 */
export async function demoLogin(req: AuthRequest, res: Response): Promise<void> {
  try {
    const demoEmail = 'recruiter.demo@personapulse.com';
    let user = await User.findOne({ email: demoEmail });

    const defaultSavedAudits = [
      {
        slug: 'stripe-checkout-v4',
        url: 'https://stripe.com/checkout',
        title: 'Stripe Checkout — Multi-Currency Payment Flow',
        overallGrade: 'B+',
        usability: 88,
        savedAt: new Date(Date.now() - 3600000 * 2),
      },
      {
        slug: 'notion-pricing-2024',
        url: 'https://notion.so/pricing',
        title: 'Notion Pricing & Feature Matrix',
        overallGrade: 'B',
        usability: 82,
        savedAt: new Date(Date.now() - 3600000 * 6),
      },
      {
        slug: 'shopify-admin-storefront',
        url: 'https://shopify.com/admin/storefront',
        title: 'Shopify Merchant Onboarding Funnel',
        overallGrade: 'B-',
        usability: 79,
        savedAt: new Date(Date.now() - 3600000 * 24),
      },
    ];

    const defaultCustomPersonas = [
      {
        name: 'Alex Rivera',
        role: 'WCAG 2.1 AAA Accessibility Specialist',
        viewportSize: 'Desktop (1440x900)',
        focusArea: 'Keyboard navigation, color contrast ratios, ARIA live announcements',
        color: '#2563EB',
        createdAt: new Date(),
      },
      {
        name: 'Elena Rostova',
        role: 'Enterprise Procurement Executive (Fortune 500)',
        viewportSize: 'MacBook Air 13" (1280x800)',
        focusArea: 'Pricing transparency, SOC2 compliance badges, security documentation',
        color: '#8B5CF6',
        createdAt: new Date(),
      },
      {
        name: 'Kenji Sato',
        role: 'High-Velocity Mobile Shopper',
        viewportSize: 'iPhone 15 Pro Max (430x932)',
        focusArea: 'Apple Pay button visibility, form autofill speed, sticky checkout bar',
        color: '#EC4899',
        createdAt: new Date(),
      },
    ];

    if (!user) {
      const passwordHash = await bcrypt.hash('DemoRecruiter2026!', 10);
      user = await User.create({
        name: 'Recruiter Demo Pro',
        email: demoEmail,
        passwordHash,
        avatarColor: '#E53E00',
        role: 'pro-recruiter',
        scansRemaining: 5,
        savedAudits: defaultSavedAudits,
        customPersonas: defaultCustomPersonas,
      });
    } else {
      // Ensure the demo user has full demo showcase data
      if (!user.savedAudits || user.savedAudits.length === 0) {
        user.savedAudits = defaultSavedAudits as any;
      }
      if (!user.customPersonas || user.customPersonas.length === 0) {
        user.customPersonas = defaultCustomPersonas as any;
      }
      user.scansRemaining = 5;
      await user.save();
    }

    const token = signToken(user);
    res.json({
      success: true,
      token,
      isDemo: true,
      user: sanitizeUser(user),
    });
  } catch (err: any) {
    console.error('Demo login error:', err);
    res.status(500).json({ success: false, error: err.message || 'Demo login failed' });
  }
}

/**
 * GET /api/auth/me
 */
export async function getMe(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }
    res.json({
      success: true,
      user: sanitizeUser(req.user),
    });
  } catch (err: any) {
    console.error('Get me error:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve profile' });
  }
}

/**
 * POST /api/auth/personas
 * Create a new custom synthetic persona
 */
export async function createPersona(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const { name, role, viewportSize, focusArea, color } = req.body;
    if (!name || !role) {
      res.status(400).json({ success: false, error: 'Persona name and role are required' });
      return;
    }

    const newPersona = {
      name: name.trim(),
      role: role.trim(),
      viewportSize: viewportSize || 'Desktop (1440x900)',
      focusArea: focusArea || 'User Experience & Conversion Flow',
      color: color || '#E53E00',
      createdAt: new Date(),
    };

    req.user.customPersonas.unshift(newPersona as any);
    await req.user.save();

    res.status(201).json({
      success: true,
      message: 'Custom persona created successfully',
      persona: newPersona,
      customPersonas: req.user.customPersonas,
    });
  } catch (err: any) {
    console.error('Create persona error:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to create persona' });
  }
}

/**
 * POST /api/auth/save-audit
 * Save or bookmark an audit to the user workspace
 */
export async function saveAudit(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const { slug, url, title, overallGrade, usability } = req.body;
    if (!slug || !url) {
      res.status(400).json({ success: false, error: 'Audit slug and URL are required' });
      return;
    }

    // Check if already saved
    const exists = req.user.savedAudits.some((a) => a.slug === slug);
    if (!exists) {
      req.user.savedAudits.unshift({
        slug,
        url,
        title: title || url,
        overallGrade: overallGrade || 'B',
        usability: usability || 85,
        savedAt: new Date(),
      } as any);
      await req.user.save();
    }

    res.json({
      success: true,
      message: 'Audit saved to personal workspace',
      savedAudits: req.user.savedAudits,
    });
  } catch (err: any) {
    console.error('Save audit error:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to save audit' });
  }
}
