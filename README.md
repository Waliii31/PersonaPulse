# PersonaPulse — Autonomous Multi-Agent User Testing & UI Remediation SaaS

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Automated%20Tests-18%20Passing-success?style=flat-square)](#automated-testing-suite)
[![Security](https://img.shields.io/badge/Security-SSRF%20Hardened%20%7C%20Rate--Limited-orange?style=flat-square)](#security--guardrail-architecture)

> **PersonaPulse** is an autonomous multi-agent user testing and UI remediation platform. Enter any website URL or explore pre-loaded sandbox audits to watch synthetic AI personas navigate the page, surface UX and WCAG accessibility friction points, and generate production-ready React + Tailwind CSS code fixes.

---

## ⚡ Key Highlights & Architecture

- **Zero-Cost Token Guardrail**: Full-page raw HTML is **never** passed to LLMs. The DOM is stripped to interactive elements (`button`, `a`, `input`, headings, bounding boxes) under **1,000 tokens** before persona prompting.
- **7-Day MongoDB Cache First**: Every scan first queries MongoDB for audits conducted within the last 7 days. Instant cache hits consume 0 API tokens and execute in milliseconds.
- **Multi-Persona Simulation Swarm**:
  - **Maya Chen (Impatient Mobile Buyer)**: Simulates 390px mobile viewport, flags friction zones, checkout abandonment risks, and touch targets < 44px.
  - **Darius Okafor (WCAG Accessibility Auditor)**: Analyzes color contrast ratios against WCAG 2.1 AAA standards, missing ARIA tags, and keyboard navigation barriers.
  - **Sandra Wu (Executive Decision Maker)**: Evaluates hero clarity, enterprise trust signals, CTA prominence, and above-the-fold value propositions.
  - **Custom Persona Builder**: Authenticated users can define their own persona heuristics, device frames, and inspection strictness.
- **Realistic Replay Canvas & IDE Workspace (`/audit/[slug]`)**:
  - Interactive multi-section website mockup rendered behind persona trajectories.
  - Animated SVG/Framer-Motion spring cursor trails with real-time thought pills and click ripples.
  - Friction Heatmap overlay toggle.
  - Viewport switcher (Desktop 1440px vs. Mobile 390px).
  - Code Remediation Drawer with copy-pasteable React + Tailwind CSS diffs.
- **Global `Cmd+K` Raycast Command Palette**: Instant keyboard navigation to sandbox audits, scan trigger, theme toggle, and Recruiter Demo login.
- **1-Click Recruiter Demo Login**: Instant one-click authentication bypass for hiring managers and recruiters to test pro workspace features without signup friction.
- **Executive Audit Brief Export**: Export scorecard metrics, persona traces, and top code patches to a printable/downloadable summary card with custom shareable links.

---

## 🏛 Monorepo Architecture

```
PersonaPulse/
├── client/                     # Next.js 14 App Router (Port 3000)
│   ├── src/
│   │   ├── app/                # / (Landing), /audit/[slug], /dashboard
│   │   ├── components/         # Navbar, ReplayCanvas, RealisticSiteMockup, CommandPalette, etc.
│   │   │   └── landing/        # 9-section high-converting landing page modules
│   │   └── lib/                # AuthContext, CommandPaletteContext, API client, types
│   ├── public/                 # Optimized static assets & mockups
│   └── package.json
│
├── server/                     # Express.js API Gateway (Port 4000)
│   ├── src/
│   │   ├── config/             # MongoDB connection & indexing
│   │   ├── controllers/        # Audit, Auth, and Contact controllers
│   │   ├── middleware/         # JWT Bearer Auth, Rate Limiter (Scan/Auth/Contact)
│   │   ├── models/             # AuditReport, User, Contact Mongoose schemas
│   │   ├── routes/             # /api/audits, /api/auth, /api/contact
│   │   ├── scripts/            # Sandbox database seeding script (Stripe, Notion, Shopify)
│   │   ├── tests/              # Automated API & SSRF test suite (13 passing tests)
│   │   └── utils/              # Security URL validator (SSRF protection)
│   └── package.json
│
├── ai-engine/                  # Python FastAPI Multi-Agent Engine (Port 8000)
│   ├── app/
│   │   ├── main.py             # FastAPI endpoints (/health, /analyze-url)
│   │   ├── agents.py           # Persona simulation & React code patch generator
│   │   ├── dom_extractor.py    # Playwright headless screenshot + DOM stripper (< 1,000 tokens)
│   │   └── schemas.py          # Pydantic data models
│   ├── tests/                  # Automated Python unit test suite (5 passing tests)
│   ├── screenshot_helper.js    # Node.js Playwright screenshot daemon
│   └── requirements.txt
│
├── docs/                       # Product requirements & specifications
├── package.json                # Monorepo root scripts & test runners
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: `v18.0.0` or later (tested on Node `v20+` and `v26`)
- **Python**: `3.10+` with `venv` or `virtualenv`
- **MongoDB**: Local MongoDB instance running on `mongodb://localhost:27017` or MongoDB Atlas URI
- **npm**: `v9.0.0+`

---

### Step 1: Clone & Configure Environment Variables

```bash
git clone https://github.com/your-username/PersonaPulse.git
cd PersonaPulse
```

Create `.env` files in each service directory using the provided `.env.example` templates:

#### `server/.env`
```env
PORT=4000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/personapulse
RATE_LIMIT_WINDOW_MS=86400000
RATE_LIMIT_MAX_REQUESTS=20
CORS_ORIGIN=http://localhost:3000
AI_ENGINE_URL=http://localhost:8000
JWT_SECRET=your_super_secret_jwt_key_here
```

#### `ai-engine/.env`
```env
PORT=8000
HOST=0.0.0.0
AI_MODE=mock # 'mock' (zero API cost) or 'live'
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
GEMINI_API_KEY=your_gemini_api_key_here
```

#### `client/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

### Step 2: Install Dependencies

```bash
# Install Server dependencies
cd server
npm install
cd ..

# Install Client dependencies
cd client
npm install
cd ..

# Install Python AI Engine dependencies
cd ai-engine
python -m venv .venv
# Windows:
.\.venv\Scripts\pip install -r requirements.txt
# macOS / Linux:
# source .venv/bin/activate && pip install -r requirements.txt
cd ..
```

---

### Step 3: Seed Sandbox Database

Seed the pre-loaded sandbox audits (Stripe, Notion, Shopify) into your MongoDB instance:

```bash
npm run seed
# or: cd server && npm run seed
```

---

### Step 4: Start Services

Open 3 terminal tabs or windows to launch each component:

#### Terminal 1 — Express API Gateway (Port 4000)
```bash
npm run dev:server
# or: cd server && npm run dev
```
*Health Check: [http://localhost:4000/api/health](http://localhost:4000/api/health)*

#### Terminal 2 — Python AI Engine (Port 8000)
```bash
npm run dev:ai
# or: cd ai-engine && .\.venv\Scripts\python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
*Health Check: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)*

#### Terminal 3 — Next.js Frontend (Port 3000)
```bash
npm run dev:client
# or: cd client && npm run dev
```
*Open application: [http://localhost:3000](http://localhost:3000)*

---

## 🧪 Automated Testing Suite

PersonaPulse includes automated unit and integration tests covering security, API endpoints, token budgets, and schemas.

### Run All Tests (Root)
```bash
npm test
```
*Executes both the Server test suite (TypeScript) and the AI Engine test suite (Python) sequentially.*

### Run Service-Specific Tests
```bash
# Server API & Security Tests (13 tests)
npm run test:server

# AI Engine Unit Tests (5 tests)
npm run test:ai
```

### Verified Test Coverage
| Suite | Component | Tests Passed | Coverage |
| :--- | :--- | :--- | :--- |
| **Server** | SSRF Security Validator | 5 / 5 | Blocks `localhost`, `127.0.0.1`, `169.254.169.254`, `10.0.0.0/8`, `file://` |
| **Server** | Gateway Endpoints | 4 / 4 | `/api/health`, `/api/audits`, `/api/audits/:slug`, `/api/audits/scan` |
| **Server** | Auth & Session | 3 / 3 | 1-Click Recruiter Demo, JWT Bearer verification, 401 Rejections |
| **Server** | Contact Inquiries | 1 / 1 | Form validation and database persistence |
| **AI Engine** | Health & SSRF | 3 / 3 | `/health`, URL schema validation, SSRF 400 rejection |
| **AI Engine** | Token Guardrail & DOM | 2 / 2 | Strips scripts/styles, enforces < 1,000 token budget, Pydantic schemas |
| **Total** | **Full Monorepo** | **18 / 18** | **100% Pass Rate** |

---

## 🔒 Security & Guardrail Architecture

1. **SSRF (Server-Side Request Forgery) Prevention**:
   - Both the Express API Gateway (`server/src/utils/urlValidator.ts`) and the Python AI Engine (`ai-engine/app/main.py`) validate target URLs before network access.
   - Strictly blocks:
     - Loopback interfaces (`127.0.0.1`, `localhost`, `::1`, `0.0.0.0`)
     - Cloud instance metadata addresses (`169.254.169.254`, `metadata.google.internal`)
     - RFC1918 Private subnets (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`)
     - Local domain extensions (`*.local`, `*.internal`, `*.localhost`, `*.test`)
     - Non-HTTP protocols (`file://`, `ftp://`, `gopher://`)
2. **Zero-Cost Token Guardrail**:
   - Scraped DOM trees are pruned using BeautifulSoup to interactive nodes only (`button`, `a`, `input`, headings).
   - Scripts, styles, SVGs, and inline tracking code are discarded to maintain payloads under 1,000 tokens before LLM prompting.
3. **Helmet & Security Headers**:
   - Express utilizes `helmet()` for defense against clickjacking, MIME-type sniffing, and cross-site scripting.
4. **Rate Limiting**:
   - Live URL audits: limited per IP to prevent API exhaustion.
   - Authentication: brute-force mitigation on `/api/auth/*`.
   - Contact inquiries: abuse prevention on `/api/contact`.
5. **Secure Authentication**:
   - Passwords hashed using `bcrypt` (10 salt rounds).
   - JWT tokens signed with expiration and sanitized user payloads (password hash never exposed).
6. **Zero Vulnerability Dependency Audit**:
   - `server` audited with **0 vulnerabilities**.
   - `client` packages resolved and verified.

---

## 💻 Manual Verification Guide

### 1. Recruiter 1-Click Demo
1. Navigate to [http://localhost:3000](http://localhost:3000).
2. Click **Login** in the top navigation bar.
3. In the modal, click **"Instant 1-Click Recruiter Demo Login"**.
4. Confirm you are instantly logged in as `Recruiter Demo` with an active Pro workspace and daily scan quota.

### 2. Interactive Sandbox Audits
1. From the landing page or navbar, click on any pre-loaded sandbox card (**Stripe Checkout**, **Notion Pricing**, or **Shopify Storefront**).
2. You will be routed to `/audit/[slug]` (e.g. `/audit/stripe-checkout-v4`).
3. Verify:
   - **Realistic Webpage Mockup**: Renders inside the Replay Canvas.
   - **Multi-Agent Cursors**: Animated cursors for Maya Chen, Darius Okafor, and Sandra Wu traverse the canvas with real-time thought pills.
   - **Heatmap Toggle**: Click the flame icon to overlay the friction heatmap.
   - **Viewport Toggle**: Switch between Desktop (1440px) and Mobile (390px).
   - **Code Remediation Drawer**: Click any issue on the right-hand panel to view the broken HTML side-by-side with the fixed React + Tailwind CSS code patch.

### 3. Command Palette (`Cmd+K` / `Ctrl+K`)
1. Press `Cmd+K` (or `Ctrl+K` on Windows) on any page.
2. Select **"Sandbox: Stripe Checkout"** to jump directly to the audit report.
3. Re-open and select **"Toggle Dark / Light Theme"** to seamlessly switch color modes.

### 4. Executive Brief Export
1. On `/audit/[slug]`, click **"Export Brief"** in the top right header.
2. The print-ready Executive Audit Brief modal opens with overall score gauges, persona feedback summaries, and a copyable shareable recruiter link.

---

## 📄 License
MIT License. Built for autonomous AI testing and UI remediation research.
