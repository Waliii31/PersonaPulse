# PersonaPulse — Production Deployment Guide

This guide covers deploying all three tiers of PersonaPulse:
1. **Frontend (`/client`)** → **Vercel**
2. **Database** → **MongoDB Atlas**
3. **AI & Browser Engine (`/ai-engine`)** → **Hugging Face Spaces** (or Railway / Render)
4. **API Gateway (`/server`)** → **Render / Railway / Fly.io**

---

## 1. MongoDB Atlas Setup (Cloud Database)

1. Create a free M0 cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Under **Network Access**, add `0.0.0.0/0` (allow access from anywhere) or restrict to your server IPs.
3. Under **Database Access**, create a user (e.g. `personapulse_admin`) with read/write privileges.
4. Copy your SRV connection string:
   ```text
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/personapulse?retryWrites=true&w=majority
   ```
5. Run the seed script once against your cloud database:
   ```bash
   cd server
   MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/personapulse" npm run seed
   ```

---

## 2. AI Engine (`/ai-engine`) Deployment

### Option A: Hugging Face Spaces (Docker or Python SDK)

1. Create a new Space on [Hugging Face](https://huggingface.co/spaces) with **SDK: Docker** (or FastAPI template).
2. Set up the `Dockerfile`:
   ```dockerfile
   FROM python:3.11-slim
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install --no-cache-dir -r requirements.txt
   COPY . .
   EXPOSE 7860
   CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
   ```
3. In **Settings → Variables and Secrets**, add:
   - `AI_MODE`: `live` (or `mock` for zero-token testing)
   - `GROQ_API_KEY`: `gsk_...`
   - `GROQ_MODEL`: `llama-3.3-70b-versatile`
   - `GEMINI_API_KEY`: (optional)
4. Note your public Space URL: `https://<username>-personapulse-ai.hf.space`.

### Option B: Railway / Render
- Root directory: `ai-engine`
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

---

## 3. Express API Gateway (`/server`) Deployment

### Deploy on Render / Railway
1. Set the root directory to `server`.
2. Build command: `npm install && npm run build`
3. Start command: `npm start`
4. Set Environment Variables:
   - `PORT`: `4000` (or leave default for cloud provider)
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `AI_ENGINE_URL`: Your deployed AI Engine URL (e.g. `https://<username>-personapulse-ai.hf.space`)
   - `CORS_ORIGIN`: Your deployed Vercel frontend URL (e.g. `https://personapulse.vercel.app`)
   - `RATE_LIMIT_MAX_REQUESTS`: `2` (enforces 2 live scans per 24 hours per IP)
   - `RATE_LIMIT_WINDOW_MS`: `86400000`

---

## 4. Next.js Frontend (`/client`) Deployment on Vercel

1. Push your repository to GitHub.
2. In the [Vercel Dashboard](https://vercel.com/new), import your repository.
3. Configure Project Settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `client`
   - **Build Command**: `next build`
   - **Output Directory**: `.next`
4. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL`: Your deployed Express API Gateway URL (e.g. `https://api.personapulse.com` or `https://personapulse-server.onrender.com`)
5. Click **Deploy**. Vercel will build and assign your production URL.

---

## 5. Verification Checklist After Deployment

- [ ] Visit Vercel production URL: Landing page loads in dark mode by default.
- [ ] Click "Stripe", "Notion", or "Shopify" sandbox cards: Loads instant audit from MongoDB cache with zero API calls.
- [ ] Submit a live URL: Pipeline triggers FastAPI, logs DOM extraction, updates scores, and saves to MongoDB Atlas.
- [ ] Click "Share Recruiter Audit Link": Copies public shareable URL.
- [ ] Click "Export Summary": Downloads Markdown report (`personapulse-audit-<slug>.md`).
