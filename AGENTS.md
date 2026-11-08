# PersonaPulse — Workspace Agent Rules

## Tech Stack & Architecture
- **Frontend (`/client`)**: Next.js (App Router), React, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion.
- **API Gateway (`/server`)**: Node.js, Express.js, TypeScript, Mongoose (MongoDB), Express Rate Limit.
- **AI & Browser Engine (`/ai-engine`)**: Python FastAPI, Playwright (Headless Chromium via MCP), OpenAI Agents SDK, Groq API, Gemini Flash API.
- **Design System**: Humblytics Swiss Editorial Light Mode default (`#FAF9F5` canvas, `#FFFFFF` containers, `#E53E00` Vermilion accents, 1px `#E6E4DD` blueprint borders with `+` crosshairs) and Dovetail pitch-black dark mode (`#050505` canvas, `#0C0C0C` containers, `#1F1F1F` borders). Zero emerald/neon green.

## Core Engineering Constraints
1. **Zero-Cost Token Guardrail**: Never send raw full-page HTML to any LLM. Always strip the DOM to interactive elements (`button`, `a`, `input`, headings, bounding boxes) under 1,000 tokens before prompting.
2. **MongoDB Caching First**: Every URL scan must check MongoDB for a cached audit within the last 7 days before calling FastAPI or any LLM API.
3. **Strict Phase Gatekeeping**: Build ONLY the phase requested in the current prompt. Never jump ahead to future phases.
4. **No Hardcoded Secrets**: Use `.env.example` templates and environment variables for all API keys and MongoDB URIs.

## Mandatory Testing & Manual Verification Protocol
At the end of every task or phase, you MUST execute this exact sequence before stopping:
1. **AI Self-Test**: Run the build, linter, and automated verification scripts (or check the UI in Antigravity's built-in Chrome preview) and fix any errors yourself.
2. **Manual Verification Hand-Off**: Output a dedicated section titled `### Manual Verification Guide for Wali` containing:
   - Exact terminal commands to start the service.
   - Exact URLs, Postman requests, or UI buttons I need to click.
   - Expected visual result, JSON output, or MongoDB document state.
   - Common failure signs to watch out for.
3. **STOP**: Wait for my explicit confirmation ("Phase passed, move to next phase") before writing code for the next module.

## Reference Documentation
See @[Product Requirements](docs/PRD.md) for product specifications and data schemas.
See @[UI Redesign & Auth Spec](docs/UI_REDESIGN.md) for v2.0 visual, animation, and authentication requirements.