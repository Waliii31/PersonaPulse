/**
 * Seed Script — PersonaPulse Sandbox Audit Reports
 * Run: npm run seed
 *
 * Populates MongoDB with 3 richly-detailed pre-loaded sandbox audits so
 * the Sandbox Mode works with ZERO API calls.
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import { AuditReport } from '../models/AuditReport';
import { connectDB, disconnectDB } from '../config/db';

/* eslint-disable quotes */
export const SANDBOX_REPORTS = [
  // ───────────────────────────────────────────────────────────────────────
  // 1. Stripe.com — Payments platform
  // ───────────────────────────────────────────────────────────────────────
  {
    url: "https://stripe.com",
    slug: "stripe-com-audit",
    isSandbox: true,
    cachedAt: new Date(),
    scores: {
      usability: 78,
      accessibility: 61,
      conversionReadiness: 72,
      overallGrade: "B",
    },
    domSnapshot: {
      title: "Stripe | Payment Processing Platform",
      viewport: { width: 1280, height: 800 },
      screenshotBase64: "",
      interactiveElements: [
        { tag: "button", text: "Start now", boundingBox: { x: 640, y: 320, width: 140, height: 44 } },
        { tag: "a", text: "Sign in", boundingBox: { x: 1140, y: 24, width: 70, height: 32 } },
        { tag: "input", text: "", ariaLabel: "Email address", boundingBox: { x: 440, y: 400, width: 320, height: 44 } },
        { tag: "button", text: "Get started", boundingBox: { x: 780, y: 400, width: 130, height: 44 } },
        { tag: "a", text: "Pricing", boundingBox: { x: 760, y: 24, width: 55, height: 32 } },
      ],
    },
    personaTraces: [
      {
        personaName: "Maya Chen",
        role: "Impatient Mobile Buyer",
        color: "#F59E0B",
        steps: [
          {
            x: 640, y: 100, elementTag: "h1",
            thought: "Big headline - okay, this is a payments company. What can I actually do here?",
            status: "pass",
          },
          {
            x: 640, y: 320, elementTag: "button",
            thought: "Start now button is prominent. But what happens when I click it? No micro-copy explains the next step.",
            status: "warn",
          },
          {
            x: 440, y: 400, elementTag: "input",
            thought: "Email field has no visible label - only placeholder text. If I make an error I lose context.",
            status: "fail",
          },
          {
            x: 780, y: 400, elementTag: "button",
            thought: "Get started and Start now - two CTAs meaning the same thing is confusing.",
            status: "warn",
          },
          {
            x: 760, y: 24, elementTag: "a",
            thought: "I need to know pricing before signing up. Good - it is in the nav.",
            status: "pass",
          },
        ],
      },
      {
        personaName: "Darius Okafor",
        role: "WCAG Accessibility Auditor",
        color: "#2563EB",
        steps: [
          {
            x: 440, y: 400, elementTag: "input",
            thought: "Input type email has no label associated via htmlFor/id pair. Fails WCAG 1.3.1.",
            status: "fail",
          },
          {
            x: 640, y: 320, elementTag: "button",
            thought: "Button contrast ratio is 3.8:1 against hero background - below the 4.5:1 required. Fails WCAG 1.4.3.",
            status: "fail",
          },
          {
            x: 1140, y: 24, elementTag: "a",
            thought: "Sign in link has sufficient contrast and descriptive text. Pass.",
            status: "pass",
          },
          {
            x: 640, y: 100, elementTag: "h1",
            thought: "Only one H1 on the page - good heading hierarchy. Pass.",
            status: "pass",
          },
          {
            x: 780, y: 400, elementTag: "button",
            thought: "Two buttons with near-identical labels - screen readers cannot distinguish intent.",
            status: "warn",
          },
        ],
      },
      {
        personaName: "Sandra Wu",
        role: "First-Time Executive",
        color: "#8B5CF6",
        steps: [
          {
            x: 640, y: 100, elementTag: "h1",
            thought: "What does financial infrastructure actually mean for my company? Too abstract.",
            status: "warn",
          },
          {
            x: 760, y: 24, elementTag: "a",
            thought: "Pricing - I need this. Let me check.",
            status: "pass",
          },
          {
            x: 640, y: 320, elementTag: "button",
            thought: "I want a demo, not to start now immediately. Where is the Request a demo option?",
            status: "fail",
          },
          {
            x: 440, y: 400, elementTag: "input",
            thought: "If I type my corporate email here, what happens? Is this a free trial or a sales form?",
            status: "warn",
          },
        ],
      },
    ],
    remediations: [
      {
        issueTitle: "Email input missing visible label",
        severity: "critical",
        brokenHtml: '<input type="email" placeholder="Email address" class="rounded px-4 py-2 border" />',
        fixedReactTailwindCode: [
          "// Fixed: Accessible email input with visible label",
          "export function EmailInput() {",
          "  return (",
          "    <div className=\"flex flex-col gap-1\">",
          "      <label",
          "        htmlFor=\"signup-email\"",
          "        className=\"text-sm font-medium text-gray-700 dark:text-gray-300\"",
          "      >",
          "        Email address",
          "      </label>",
          "      <input",
          "        id=\"signup-email\"",
          "        type=\"email\"",
          "        autoComplete=\"email\"",
          "        placeholder=\"you@company.com\"",
          "        className=\"rounded-lg px-4 py-2.5 border border-gray-300 dark:border-gray-600",
          "                   bg-white dark:bg-gray-900 text-gray-900 dark:text-white",
          "                   focus:outline-none focus:ring-2 focus:ring-indigo-500",
          "                   transition-colors\"",
          "        aria-describedby=\"email-hint\"",
          "      />",
          "      <p id=\"email-hint\" className=\"text-xs text-gray-500\">",
          "        We will send your account confirmation here.",
          "      </p>",
          "    </div>",
          "  );",
          "}",
        ].join("\n"),
        explanation:
          "Associating a visible label via htmlFor/id satisfies WCAG 1.3.1 and helps sighted users who clear the placeholder. The aria-describedby hint provides extra context for screen reader users.",
      },
      {
        issueTitle: "Duplicate CTA buttons with ambiguous labels",
        severity: "high",
        brokenHtml: '<button class="btn-primary">Start now</button>\n<button class="btn-primary">Get started</button>',
        fixedReactTailwindCode: [
          "// Fixed: Single primary CTA + secondary demo request",
          "export function HeroCTA() {",
          "  return (",
          "    <div className=\"flex flex-col sm:flex-row gap-3 mt-6\">",
          "      <a",
          "        href=\"/register\"",
          "        className=\"inline-flex items-center justify-center px-6 py-3 rounded-xl",
          "                   bg-indigo-600 hover:bg-indigo-700 text-white font-semibold",
          "                   transition-colors focus:outline-none focus:ring-2",
          "                   focus:ring-offset-2 focus:ring-indigo-500\"",
          "      >",
          "        Start for free",
          "        <span className=\"ml-2 text-sm font-normal opacity-80\">No credit card</span>",
          "      </a>",
          "      <a",
          "        href=\"/contact/sales\"",
          "        className=\"inline-flex items-center justify-center px-6 py-3 rounded-xl",
          "                   border border-gray-300 dark:border-gray-600 text-gray-700",
          "                   dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800",
          "                   font-semibold transition-colors\"",
          "      >",
          "        Request a demo",
          "      </a>",
          "    </div>",
          "  );",
          "}",
        ].join("\n"),
        explanation:
          "Consolidating to one primary action with a trust signal and a secondary demo path serves both self-service buyers and enterprise decision-makers without duplicating intent.",
      },
      {
        issueTitle: "Hero button fails WCAG 1.4.3 contrast ratio",
        severity: "high",
        brokenHtml: '<button style="background:#635BFF;color:#fff;opacity:0.75">Start now</button>',
        fixedReactTailwindCode: [
          "// Fixed: Full-opacity button with compliant contrast ratio (7.4:1)",
          "export function PrimaryButton({ children }: { children: React.ReactNode }) {",
          "  return (",
          "    <button",
          "      className=\"bg-indigo-600 hover:bg-indigo-700 text-white font-semibold",
          "                 px-6 py-3 rounded-xl transition-colors",
          "                 focus-visible:outline focus-visible:outline-2",
          "                 focus-visible:outline-offset-2 focus-visible:outline-indigo-600\"",
          "    >",
          "      {children}",
          "    </button>",
          "  );",
          "}",
        ].join("\n"),
        explanation:
          "Removing opacity from the button background brings the white-on-indigo contrast ratio from 3.8:1 to 7.4:1, exceeding the WCAG AA threshold of 4.5:1.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  // 2. Notion.so — Productivity SaaS
  // ───────────────────────────────────────────────────────────────────────
  {
    url: "https://notion.so",
    slug: "notion-so-audit",
    isSandbox: true,
    cachedAt: new Date(),
    scores: {
      usability: 85,
      accessibility: 54,
      conversionReadiness: 80,
      overallGrade: "B+",
    },
    domSnapshot: {
      title: "Notion - One workspace. Every team.",
      viewport: { width: 1280, height: 800 },
      screenshotBase64: "",
      interactiveElements: [
        { tag: "button", text: "Get Notion free", boundingBox: { x: 580, y: 360, width: 180, height: 48 } },
        { tag: "button", text: "Request a demo", boundingBox: { x: 780, y: 360, width: 160, height: 48 } },
        { tag: "input", text: "", ariaLabel: "Email", boundingBox: { x: 380, y: 360, width: 200, height: 48 } },
        { tag: "a", text: "Log in", boundingBox: { x: 1180, y: 20, width: 60, height: 32 } },
        { tag: "button", text: "Templates", boundingBox: { x: 540, y: 20, width: 100, height: 32 } },
      ],
    },
    personaTraces: [
      {
        personaName: "Maya Chen",
        role: "Impatient Mobile Buyer",
        color: "#F59E0B",
        steps: [
          {
            x: 640, y: 180, elementTag: "h1",
            thought: "One workspace. Every team. - Vague. What do I actually get?",
            status: "warn",
          },
          {
            x: 380, y: 360, elementTag: "input",
            thought: "Email input is right in the hero. Good placement. But placeholder says Enter your email - no label.",
            status: "warn",
          },
          {
            x: 580, y: 360, elementTag: "button",
            thought: "Get Notion free - clear value proposition. I know it is free. I will click.",
            status: "pass",
          },
          {
            x: 540, y: 20, elementTag: "button",
            thought: "Templates is a nav item - good for exploring before committing.",
            status: "pass",
          },
        ],
      },
      {
        personaName: "Darius Okafor",
        role: "WCAG Accessibility Auditor",
        color: "#2563EB",
        steps: [
          {
            x: 380, y: 360, elementTag: "input",
            thought: "Email input: placeholder only, no label element. WCAG 1.3.1 fail. Placeholder disappears on focus.",
            status: "fail",
          },
          {
            x: 580, y: 360, elementTag: "button",
            thought: "Get Notion free - dark background, white text. Contrast passes at 8.2:1. WCAG AA pass.",
            status: "pass",
          },
          {
            x: 640, y: 180, elementTag: "h1",
            thought: "Single H1 - heading hierarchy is correct. Pass.",
            status: "pass",
          },
          {
            x: 1180, y: 20, elementTag: "a",
            thought: "Log in link: no focus indicator visible in default theme. WCAG 2.4.7 fail.",
            status: "fail",
          },
          {
            x: 780, y: 360, elementTag: "button",
            thought: "Request a demo button uses light grey background - contrast ratio 2.9:1. Fails WCAG 1.4.3.",
            status: "fail",
          },
        ],
      },
      {
        personaName: "Sandra Wu",
        role: "First-Time Executive",
        color: "#8B5CF6",
        steps: [
          {
            x: 640, y: 180, elementTag: "h1",
            thought: "Generic tagline. I need to know: does Notion replace my current PM tools?",
            status: "warn",
          },
          {
            x: 780, y: 360, elementTag: "button",
            thought: "Request a demo - perfect for me. But the button looks secondary/disabled.",
            status: "warn",
          },
          {
            x: 580, y: 360, elementTag: "button",
            thought: "Free plan sounds good for a pilot. Clicking.",
            status: "pass",
          },
          {
            x: 540, y: 20, elementTag: "button",
            thought: "No pricing visible in the main nav - I have to hunt for it.",
            status: "fail",
          },
        ],
      },
    ],
    remediations: [
      {
        issueTitle: "Hero email input missing persistent label",
        severity: "critical",
        brokenHtml: '<input type="email" placeholder="Enter your email" class="border rounded px-3 py-2" />',
        fixedReactTailwindCode: [
          "// Fixed: Visible label + accessible hero email capture",
          "export function HeroEmailCapture() {",
          "  return (",
          "    <form className=\"flex flex-col sm:flex-row gap-2 w-full max-w-md mx-auto\">",
          "      <div className=\"flex flex-col flex-1 gap-1\">",
          "        <label htmlFor=\"hero-email\" className=\"sr-only\">",
          "          Work email address",
          "        </label>",
          "        <input",
          "          id=\"hero-email\"",
          "          type=\"email\"",
          "          autoComplete=\"email\"",
          "          placeholder=\"work@company.com\"",
          "          required",
          "          className=\"flex-1 px-4 py-3 rounded-xl border border-gray-300",
          "                     dark:border-gray-600 bg-white dark:bg-gray-900",
          "                     text-gray-900 dark:text-white placeholder-gray-400",
          "                     focus:outline-none focus:ring-2 focus:ring-black",
          "                     dark:focus:ring-white transition-shadow\"",
          "        />",
          "      </div>",
          "      <button",
          "        type=\"submit\"",
          "        className=\"px-5 py-3 bg-black dark:bg-white text-white dark:text-black",
          "                   font-semibold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100",
          "                   transition-colors whitespace-nowrap\"",
          "      >",
          "        Get Notion free",
          "      </button>",
          "    </form>",
          "  );",
          "}",
        ].join("\n"),
        explanation:
          "Using sr-only keeps the label visually hidden while remaining accessible to screen readers. This satisfies WCAG 1.3.1 without redesigning the hero.",
      },
      {
        issueTitle: "Navigation links missing visible focus indicator",
        severity: "high",
        brokenHtml: '<a href="/login" class="text-sm text-gray-600 hover:text-gray-900">Log in</a>',
        fixedReactTailwindCode: [
          "// Fixed: Nav link with WCAG 2.4.7 compliant focus ring",
          "export function NavLink({",
          "  href,",
          "  children,",
          "}: {",
          "  href: string;",
          "  children: React.ReactNode;",
          "}) {",
          "  return (",
          "    <a",
          "      href={href}",
          "      className=\"text-sm text-gray-600 dark:text-gray-300",
          "                 hover:text-gray-900 dark:hover:text-white",
          "                 rounded px-1 py-0.5",
          "                 focus-visible:outline-none focus-visible:ring-2",
          "                 focus-visible:ring-offset-2 focus-visible:ring-black",
          "                 dark:focus-visible:ring-white transition-colors\"",
          "    >",
          "      {children}",
          "    </a>",
          "  );",
          "}",
        ].join("\n"),
        explanation:
          "Adding focus-visible:ring-2 ensures keyboard navigators see a clear focus ring without affecting mouse-click appearance. Satisfies WCAG 2.4.7.",
      },
      {
        issueTitle: "Request a demo button fails contrast threshold",
        severity: "high",
        brokenHtml: '<button class="bg-gray-100 text-gray-500 px-6 py-3 rounded-lg">Request a demo</button>',
        fixedReactTailwindCode: [
          "// Fixed: Demo CTA with outlined style that meets contrast requirements",
          "export function SecondaryButton({ children, href }: { children: React.ReactNode; href: string }) {",
          "  return (",
          "    <a",
          "      href={href}",
          "      className=\"inline-flex items-center justify-center px-6 py-3 rounded-xl",
          "                 border-2 border-gray-900 dark:border-white",
          "                 text-gray-900 dark:text-white font-semibold",
          "                 hover:bg-gray-100 dark:hover:bg-gray-800",
          "                 focus-visible:outline-none focus-visible:ring-2",
          "                 focus-visible:ring-offset-2 focus-visible:ring-gray-900",
          "                 transition-colors\"",
          "    >",
          "      {children}",
          "    </a>",
          "  );",
          "}",
        ].join("\n"),
        explanation:
          "Switching to a bordered/outlined style with dark border on white background yields a 21:1 contrast ratio for the border and 15:1 for the text - far exceeding WCAG AA and AAA thresholds.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  // 3. Shopify.com — E-commerce platform
  // ───────────────────────────────────────────────────────────────────────
  {
    url: "https://shopify.com",
    slug: "shopify-com-audit",
    isSandbox: true,
    cachedAt: new Date(),
    scores: {
      usability: 91,
      accessibility: 70,
      conversionReadiness: 88,
      overallGrade: "A-",
    },
    domSnapshot: {
      title: "Shopify - Start Your Business, Grow Your Brand",
      viewport: { width: 1280, height: 800 },
      screenshotBase64: "",
      interactiveElements: [
        { tag: "input", text: "", ariaLabel: "Email address", boundingBox: { x: 420, y: 400, width: 280, height: 52 } },
        { tag: "button", text: "Start free trial", boundingBox: { x: 710, y: 400, width: 160, height: 52 } },
        { tag: "a", text: "Log in", boundingBox: { x: 1180, y: 20, width: 60, height: 32 } },
        { tag: "button", text: "Pricing", boundingBox: { x: 700, y: 20, width: 65, height: 32 } },
        { tag: "a", text: "Watch demo", boundingBox: { x: 640, y: 480, width: 120, height: 40 } },
      ],
    },
    personaTraces: [
      {
        personaName: "Maya Chen",
        role: "Impatient Mobile Buyer",
        color: "#F59E0B",
        steps: [
          {
            x: 640, y: 200, elementTag: "h1",
            thought: "Start your business - immediately clear. This is for merchants.",
            status: "pass",
          },
          {
            x: 420, y: 400, elementTag: "input",
            thought: "Email field right in the hero. The 3-day free trial is called out. High trust signal.",
            status: "pass",
          },
          {
            x: 710, y: 400, elementTag: "button",
            thought: "Start free trial - explicit, low commitment. This is excellent copy.",
            status: "pass",
          },
          {
            x: 640, y: 480, elementTag: "a",
            thought: "Watch demo is below the fold slightly. Some users will miss it.",
            status: "warn",
          },
          {
            x: 700, y: 20, elementTag: "button",
            thought: "Pricing in the nav - good. No surprises later.",
            status: "pass",
          },
        ],
      },
      {
        personaName: "Darius Okafor",
        role: "WCAG Accessibility Auditor",
        color: "#2563EB",
        steps: [
          {
            x: 420, y: 400, elementTag: "input",
            thought: "Input has aria-label Email address - no visible label but aria-label satisfies WCAG 1.3.1 programmatically. Conditional pass.",
            status: "warn",
          },
          {
            x: 710, y: 400, elementTag: "button",
            thought: "Green button #96BF48 on white - contrast 2.6:1. Critical WCAG 1.4.3 fail.",
            status: "fail",
          },
          {
            x: 640, y: 200, elementTag: "h1",
            thought: "Proper H1, no skip-to-main-content link detected.",
            status: "warn",
          },
          {
            x: 640, y: 480, elementTag: "a",
            thought: "Watch demo link has descriptive text and an aria-label. Good.",
            status: "pass",
          },
          {
            x: 1180, y: 20, elementTag: "a",
            thought: "Log in has visible focus ring on tab - WCAG 2.4.7 passes.",
            status: "pass",
          },
        ],
      },
      {
        personaName: "Sandra Wu",
        role: "First-Time Executive",
        color: "#8B5CF6",
        steps: [
          {
            x: 640, y: 200, elementTag: "h1",
            thought: "The headline is for entrepreneurs but I represent a mid-market company. No enterprise path visible.",
            status: "warn",
          },
          {
            x: 700, y: 20, elementTag: "button",
            thought: "Pricing - immediately finding this for budget planning.",
            status: "pass",
          },
          {
            x: 710, y: 400, elementTag: "button",
            thought: "3-day trial is very short for enterprise evaluation. Need a Contact sales option.",
            status: "fail",
          },
          {
            x: 640, y: 480, elementTag: "a",
            thought: "Watch demo - this is what I need. Clicking.",
            status: "pass",
          },
        ],
      },
    ],
    remediations: [
      {
        issueTitle: "CTA button brand green fails WCAG contrast",
        severity: "critical",
        brokenHtml: '<button style="background-color:#96BF48;color:#fff;" class="px-6 py-3 rounded">\n  Start free trial\n</button>',
        fixedReactTailwindCode: [
          "// Fixed: Shopify-green CTA with WCAG AA compliant darker shade",
          "export function TrialButton() {",
          "  return (",
          "    <button",
          "      type=\"submit\"",
          "      className=\"inline-flex items-center gap-2 px-6 py-3.5 rounded-xl",
          "                 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-base",
          "                 shadow-lg hover:shadow-xl transition-all",
          "                 focus-visible:outline-none focus-visible:ring-4",
          "                 focus-visible:ring-green-400 focus-visible:ring-offset-2\"",
          "    >",
          "      Start free trial",
          "      <svg",
          "        className=\"w-4 h-4\"",
          "        fill=\"none\"",
          "        viewBox=\"0 0 24 24\"",
          "        stroke=\"currentColor\"",
          "        aria-hidden=\"true\"",
          "      >",
          "        <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M9 5l7 7-7 7\" />",
          "      </svg>",
          "    </button>",
          "  );",
          "}",
        ].join("\n"),
        explanation:
          "The original #96BF48 on white yields a 2.6:1 contrast ratio. Switching to #2E7D32 gives 7.1:1 - WCAG AA and AAA compliant - while keeping the green brand identity.",
      },
      {
        issueTitle: "Missing skip-to-main-content link for keyboard users",
        severity: "medium",
        brokenHtml: "<!-- No skip navigation link present in the page head area -->\n<nav>...</nav>\n<main>...</main>",
        fixedReactTailwindCode: [
          "// Fixed: Skip-to-content link for keyboard/screen reader efficiency",
          "export function SkipToMain() {",
          "  return (",
          "    <a",
          "      href=\"#main-content\"",
          "      className=\"sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4",
          "                 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg",
          "                 focus:bg-green-700 focus:text-white focus:font-semibold",
          "                 focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-300",
          "                 transition-all\"",
          "    >",
          "      Skip to main content",
          "    </a>",
          "  );",
          "}",
          "",
          "// In your layout:",
          "// <SkipToMain />",
          "// <nav>...</nav>",
          "// <main id=\"main-content\">...</main>",
        ].join("\n"),
        explanation:
          "A skip-nav link satisfies WCAG 2.4.1 (Bypass Blocks) and dramatically reduces keyboard navigation burden.",
      },
      {
        issueTitle: "No enterprise/sales path for executive visitors",
        severity: "medium",
        brokenHtml: '<div class="hero-cta">\n  <input type="email" placeholder="Email address" />\n  <button>Start free trial</button>\n</div>',
        fixedReactTailwindCode: [
          "// Fixed: Dual-path hero CTA for self-serve and enterprise segments",
          "export function HeroCTADual() {",
          "  return (",
          "    <div className=\"flex flex-col gap-4 w-full max-w-lg\">",
          "      <form className=\"flex flex-col sm:flex-row gap-2\">",
          "        <label htmlFor=\"hero-email\" className=\"sr-only\">",
          "          Email address",
          "        </label>",
          "        <input",
          "          id=\"hero-email\"",
          "          type=\"email\"",
          "          autoComplete=\"email\"",
          "          placeholder=\"your@email.com\"",
          "          required",
          "          className=\"flex-1 px-4 py-3.5 rounded-xl border border-gray-300",
          "                     dark:border-gray-600 focus:outline-none focus:ring-2",
          "                     focus:ring-green-600 dark:bg-gray-900 dark:text-white\"",
          "        />",
          "        <button",
          "          type=\"submit\"",
          "          className=\"px-5 py-3.5 bg-[#2E7D32] hover:bg-[#1B5E20] text-white",
          "                     font-bold rounded-xl transition-colors whitespace-nowrap\"",
          "        >",
          "          Start free trial",
          "        </button>",
          "      </form>",
          "      <div className=\"flex items-center gap-2 text-sm text-gray-500\">",
          "        <span className=\"flex-1 h-px bg-gray-200 dark:bg-gray-700\" />",
          "        <span>or</span>",
          "        <span className=\"flex-1 h-px bg-gray-200 dark:bg-gray-700\" />",
          "      </div>",
          "      <a",
          "        href=\"/enterprise\"",
          "        className=\"text-center text-sm font-medium text-green-700 dark:text-green-400",
          "                   hover:underline focus-visible:outline-none focus-visible:ring-2",
          "                   focus-visible:ring-green-500 rounded\"",
          "      >",
          "        Building a larger business? Talk to our sales team",
          "      </a>",
          "    </div>",
          "  );",
          "}",
        ].join("\n"),
        explanation:
          "Adding an enterprise path beneath the primary CTA captures executive visitors who won't start a 3-day trial without diluting the primary conversion.",
      },
    ],
  },
];

export async function seedSandboxDatabase(force = false): Promise<{ count: number; inserted: number; message: string }> {
  if (force) {
    const deleted = await AuditReport.deleteMany({ isSandbox: true });
    console.log(`🧹 Force seed: Deleted ${deleted.deletedCount} existing sandbox reports.`);
  }

  const count = await AuditReport.countDocuments({ isSandbox: true });
  if (count > 0 && !force) {
    console.log(`ℹ️  Found ${count} existing sandbox audit report(s).`);
    return { count, inserted: 0, message: `Database already seeded with ${count} sandbox reports.` };
  }

  const inserted = await AuditReport.insertMany(SANDBOX_REPORTS);
  console.log(`✅ Auto-seeded ${inserted.length} sandbox audit reports:`);
  inserted.forEach((r) =>
    console.log(`  [${r.scores.overallGrade}] ${r.url}  ->  /api/audits/${r.slug}`)
  );
  return { count: inserted.length, inserted: inserted.length, message: `Successfully seeded ${inserted.length} sandbox reports.` };
}

async function seed(): Promise<void> {
  await connectDB();

  const deleted = await AuditReport.deleteMany({ isSandbox: true });
  console.log(`Removed ${deleted.deletedCount} existing sandbox reports`);

  const inserted = await AuditReport.insertMany(SANDBOX_REPORTS);
  console.log(`Seeded ${inserted.length} sandbox audit reports:`);
  inserted.forEach((r) =>
    console.log(`  [${r.scores.overallGrade}] ${r.url}  ->  /api/audits/${r.slug}`)
  );

  await disconnectDB();
  console.log("MongoDB disconnected. Seed complete.");
}

if (require.main === module) {
  seed().catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
}
