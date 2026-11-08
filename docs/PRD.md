# PersonaPulse — Product Requirements Document (PRD)

## 1. Product Overview
PersonaPulse is an Autonomous Multi-Agent User Testing & UI Remediation SaaS. Users enter a website URL (or select a pre-loaded sandbox company), and synthetic AI personas navigate the page, identify UX and accessibility friction points, and generate copy-pasteable React + Tailwind CSS code fixes.

## 2. Core User Flows
1. **Instant Sandbox Mode (Zero API Cost)**: Visitors click a pre-loaded audit on the landing page to watch animated multi-agent cursors traverse a snapshot of a target website, view friction heatmaps, and toggle before/after React + Tailwind CSS fixes directly from MongoDB cache.
2. **Live URL Audit Mode**: Users submit a URL. The Express gateway checks MongoDB cache. On a cache miss, it calls the FastAPI service, which scrapes a compact DOM tree via Playwright, runs 3 synthetic personas (Impatient Mobile Buyer, WCAG Accessibility Auditor, First-Time Executive), and returns structured JSON scores, cursor coordinates, and Tailwind CSS code patches.
3. **Shareable Recruiter Audit Link**: Every scan generates a clean public route (`/audit/[slug]`) with an Executive Scorecard (Usability Score, Accessibility Grade, Drop-off Risk, and Code Remediation Drawer).

## 3. MongoDB Data Schema (`AuditReport`)
- `url` (String, indexed)
- `slug` (String, unique)
- `cachedAt` (Date)
- `scores`: `{ usability: Number, accessibility: Number, conversionReadiness: Number, overallGrade: String }`
- `domSnapshot`: `{ title: String, viewport: Object, screenshotBase64: String, interactiveElements: Array }`
- `personaTraces`: Array of `{ personaName: String, role: String, color: String, steps: Array<{ x: Number, y: Number, elementTag: String, thought: String, status: 'pass' | 'warn' | 'fail' }> }`
- `remediations`: Array of `{ issueTitle: String, severity: String, brokenHtml: String, fixedReactTailwindCode: String, explanation: String }`