# PersonaPulse v2.0 — Anti-"AI Slop" UI Redesign, Smooth Scroll & Auth Spec

## 1. Animation & Smooth Scrolling Stack
- **Smooth Scrolling**: `@studio-freight/lenis` (or `lenis`) integrated globally with **GSAP (`gsap` + `@gsap/react` + `ScrollTrigger`)** for buttery 120fps inertia scrolling and pinned scrollytelling sections.
- **Micro-Interactions & Layout Transitions**: `framer-motion` for spring-physics cursor animations, shared layout tabs (`layoutId`), and modal transitions.
- **Visual Aesthetic (Linear / Vercel / Raycast Style)**:
  - Eliminate flat 3-column neon-green boxes.
  - Use subtle 1px gradient borders (`border-white/[0.08]`), radial mouse-tracking spotlight hover cards, background architectural dot/grid matrices with radial fade masks, and glassmorphic floating surfaces (`backdrop-blur-xl bg-white/[0.03]`).

## 2. The 9-Section High-Converting Landing Page
1. **Section 1 — Floating Glassmorphic Command Navbar**: Logo, section links, `Cmd+K` Quick Audit Search trigger, Theme Toggle, and Auth State (Log In / Sign Up or User Avatar + "My Workspace").
2. **Section 2 — 3D Perspective Hero & Live Mockup Stage**: Split/layered hero with kinetic typography, live URL scanner bar, and a 3D-tilted (`rotateX(18deg)`) interactive browser window that flattens smoothly on scroll via GSAP ScrollTrigger while animated AI cursors actively inspect a realistic miniature SaaS UI inside the frame.
3. **Section 3 — Live Telemetry & Architecture Ribbon**: Infinite smooth marquee displaying tech stack nodes, latency metrics, and a live counter of cached audits & tokens saved.
4. **Section 4 — Asymmetrical Bento Grid (6 Core Capabilities)**: Interactive bento cards with embedded micro-animations (Live DOM Tree Stripper animation, WCAG Contrast Radar, Multi-Agent Swarm Node Graph, 0-Token MongoDB Cache Hit ring, AST React Patch Generator, and Instant Recruiter Link sharing).
5. **Section 5 — GSAP Pinned Scrollytelling ("Inside the 4-Stage Autonomous Pipeline")**: Sticky scroll section where scrolling progresses through 4 animated stages: (1) Playwright DOM Extraction -> (2) Persona Spawning -> (3) Coordinate Friction Mapping -> (4) React + Tailwind Code Synthesis.
6. **Section 6 — Interactive Before/After UI & Code Slider**: Embedded draggable split-screen mockup on the landing page where visitors drag a handle to watch a broken checkout UI morph into a remediated Tailwind UI alongside the live React diff.
7. **Section 7 — Interactive Persona Command Deck**: Tabbed interactive showcase (Maya Chen, Darius Okafor, Sandra Wu, + "Custom Persona") showing each agent's simulated device frame (iPhone 17 Pro viewport vs. Desktop Screen Reader), cognitive heuristics, and live thought stream.
8. **Section 8 — Visual Sandbox Vault (Rich Website Previews)**: Pre-loaded audits (Stripe, Notion, Shopify) displayed as visual browser thumbnails with mini heatmap overlays, circular SVG score gauges, and 1-click launch.
9. **Section 9 — SaaS Tier Matrix & Kinetic Footer**: Free Sandbox vs. Pro Engineer vs. Team CI/CD comparison cards, interactive FAQ accordion, and a high-contrast kinetic typography footer.

## 3. Realistic Website Mockup Canvas & IDE Workspace (`/audit/[slug]`)
- **Replace the Blank Dark Box**: The Replay Canvas MUST render a realistic, multi-section miniature webpage DOM mockup inside the browser frame (complete with navbar, hero CTA buttons, pricing cards, form inputs, and contrast flaws) matching the audited target so AI cursors visibly hover over real UI elements.
- **IDE Split-Screen Layout**: Convert the long vertical page into a compact, viewport-locked or cleanly tabbed SaaS workspace with a sticky top bar, left/center Interactive Replay Canvas, and a right-hand tabbed Inspector Panel (`[Persona Traces]`, `[Code Remediations]`, `[Executive Scorecard]`).

## 4. Authentication & Personalization System
- **Backend (`/server`)**: `User` Mongoose model (`name`, `email`, `passwordHash`, `role`, `savedAudits`, `customPersonas`, `dailyScansUsed`). JWT authentication (`POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/demo`, `GET /api/auth/me`).
- **1-Click Recruiter Demo Login**: A prominent button inside the Login/Signup modal ("Instant 1-Click Recruiter Demo Login") that logs in a pre-seeded Pro account immediately without typing credentials.
- **Personal Workspace (`/dashboard`)**: Authenticated route displaying the user's saved/scanned audits, a "Custom Persona Builder" (define custom agent name, role, viewport, and strictness), and a daily token/scan quota meter.