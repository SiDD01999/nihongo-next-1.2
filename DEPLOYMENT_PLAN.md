# Nihongo Next - Deployment Plan

## Architecture Overview

```
┌─────────────┐       ┌─────────────┐       ┌─────────────────┐
│   Vercel     │       │   Render    │       │   Free DB       │
│  (Frontend)  │──────▶│  (Backend)  │──────▶│  (PostgreSQL/   │
│  React SPA   │  API  │  Express.js │       │   MongoDB)      │
└─────────────┘       └─────────────┘       └─────────────────┘
```

- **Frontend (Vercel):** React SPA (CRA + Craco)
- **Backend (Render):** Node.js + Express.js
- **Database:** Replace JSON file storage with a real database

---

## Free Database Options

| Provider | Type | Free Tier | Limits | Best For |
|----------|------|-----------|--------|----------|
| **Neon** | PostgreSQL | Forever free | 0.5 GB storage, 190 compute-hours/month | Best overall - serverless Postgres, generous free tier |
| **Supabase** | PostgreSQL | Free tier | 500 MB storage, 2 projects | Good if you want auth/realtime features built-in |
| **MongoDB Atlas** | MongoDB | M0 free cluster | 512 MB storage | Good if you prefer NoSQL / document storage |
| **PlanetScale** | MySQL | Hobby plan (limited) | 1 GB storage, 1 billion row reads/month | Good for MySQL preference |
| **Railway** | PostgreSQL | Trial / $5 credit | 1 GB storage | Quick to set up, but credit-based |
| **Turso** | SQLite (libSQL) | Free tier | 9 GB storage, 500M rows read | Edge-optimized SQLite |

### Recommendation: **Neon (PostgreSQL)**

**Why Neon?**
1. **Truly free forever** - no credit card required, no trial expiration
2. **PostgreSQL** - industry-standard relational DB, pairs well with Prisma ORM
3. **Serverless** - auto-scales, auto-suspends when inactive (saves resources)
4. **Generous limits** - 0.5 GB is plenty for a blog app with users/posts/comments
5. **Great DX** - web dashboard, branching, connection pooling built-in

---

## Problems Identified (Must Fix Before Deployment)

### P1 - Critical (Deployment Blockers)

| # | Problem | Location | Description |
|---|---------|----------|-------------|
| 1 | **Hardcoded API URLs** | `frontend/src/pages/BlogListPage.jsx`, `BlogPostPage.jsx`, `SignUpPage.jsx`, `LoginPage.jsx` | All API calls use `http://localhost:4000/api/...` - will fail in production |
| 2 | **JSON file-based "database"** | `backend/data/posts.json`, `backend/data/users.json` | Render uses ephemeral filesystems - **all data will be lost on every deploy/restart** |
| 3 | **CORS whitelist is localhost-only** | `backend/server.js` | Only allows `localhost:3000` and `localhost:3001` - will block Vercel frontend |
| 4 | **No environment variable setup** | Frontend + Backend | No `.env` files, no `process.env.REACT_APP_*` usage in frontend |

### P2 - High (Security & Reliability)

| # | Problem | Location | Description |
|---|---------|----------|-------------|
| 5 | **Hardcoded JWT secret** | `backend/routes/auth.js` | Uses fallback `'nihongo-next-secret-key-2024'` - must use env var in production |
| 6 | **No production CORS config** | `backend/server.js` | Need to set allowed origins from env var for the Vercel domain |
| 7 | **Synchronous file I/O** | `backend/routes/posts.js`, `backend/routes/auth.js` | Uses `fs.readFileSync`/`fs.writeFileSync` - blocks event loop (moot once we migrate to DB) |

### P3 - Medium (Good Practice)

| # | Problem | Location | Description |
|---|---------|----------|-------------|
| 8 | **No health check for Render** | `backend/server.js` | Has `/api/health` but Render needs to know about it |
| 9 | **No `render.yaml`** | Root | Render blueprint file for automated deployment config |
| 10 | **Vercel config is minimal** | `frontend/vercel.json` | Needs SPA rewrite rules for React Router |
| 11 | **No production build validation** | - | Haven't verified `npm run build` succeeds |

---

## Implementation Plan (Step by Step)

### Phase 1: Database Migration (JSON → PostgreSQL with Prisma)

**Step 1.1 - Install Prisma & configure**
- Install `prisma` and `@prisma/client` in backend
- Create `backend/prisma/schema.prisma` with models:

```prisma
model User {
  id        Int       @id @default(autoincrement())
  name      String
  email     String    @unique
  password  String
  createdAt DateTime  @default(now())
  comments  Comment[]
}

model Post {
  id        Int       @id @default(autoincrement())
  slug      String    @unique
  title     String
  excerpt   String
  content   String?
  category  String
  author    String
  date      String
  readTime  String
  tags      String[]
  featured  Boolean   @default(false)
  image     String?
  comments  Comment[]
}

model Comment {
  id        Int      @id @default(autoincrement())
  name      String
  text      String
  time      String
  likes     Int      @default(0)
  post      Post     @relation(fields: [postId], references: [id])
  postId    Int
  user      User?    @relation(fields: [userId], references: [id])
  userId    Int?
}
```

**Step 1.2 - Create database utility**
- Create `backend/lib/prisma.js` for Prisma client singleton

**Step 1.3 - Rewrite routes to use Prisma**
- Rewrite `backend/routes/auth.js` - replace JSON file reads/writes with Prisma User queries
- Rewrite `backend/routes/posts.js` - replace JSON file reads/writes with Prisma Post/Comment queries

**Step 1.4 - Create seed script**
- Create `backend/prisma/seed.js` to migrate existing `posts.json` data into the database

### Phase 2: Environment Variables & Configuration

**Step 2.1 - Backend environment variables**
- Create `backend/.env.example` with:
  ```
  DATABASE_URL=postgresql://...
  JWT_SECRET=your-secret-key
  CORS_ORIGIN=http://localhost:3000
  PORT=4000
  ```
- Update `backend/server.js` to read CORS from `process.env.CORS_ORIGIN`
- Update `backend/routes/auth.js` to require `JWT_SECRET` env var (no fallback)

**Step 2.2 - Frontend environment variables**
- Create `frontend/.env.example` with:
  ```
  REACT_APP_API_URL=http://localhost:4000/api
  ```
- Create an API config utility: `frontend/src/config/api.js`
- Update all pages to use `process.env.REACT_APP_API_URL` instead of hardcoded URLs

### Phase 3: CORS & Security Fixes

**Step 3.1 - Dynamic CORS**
- Update `backend/server.js` CORS config to use `CORS_ORIGIN` env var
- Support multiple origins (comma-separated) for staging + production

**Step 3.2 - Security hardening**
- Remove hardcoded JWT secret fallback
- Add `helmet` middleware for security headers
- Add `express-rate-limit` for rate limiting auth endpoints

### Phase 4: Deployment Configuration

**Step 4.1 - Vercel config (Frontend)**
- Update `frontend/vercel.json` with SPA rewrites:
  ```json
  {
    "installCommand": "npm install --legacy-peer-deps",
    "rewrites": [
      { "source": "/(.*)", "destination": "/index.html" }
    ]
  }
  ```
- Set env var `REACT_APP_API_URL` in Vercel dashboard

**Step 4.2 - Render config (Backend)**
- Create `render.yaml` blueprint:
  ```yaml
  services:
    - type: web
      name: nihongo-next-api
      runtime: node
      buildCommand: cd backend && npm install && npx prisma generate && npx prisma db push
      startCommand: cd backend && node server.js
      healthCheckPath: /api/health
      envVars:
        - key: DATABASE_URL
          sync: false
        - key: JWT_SECRET
          generateValue: true
        - key: CORS_ORIGIN
          value: https://your-vercel-domain.vercel.app
        - key: NODE_ENV
          value: production
  ```

**Step 4.3 - Add start scripts for Render**
- Update `backend/package.json` with proper start script and Prisma postinstall

### Phase 5: Testing & Validation

**Step 5.1 - Verify frontend build**
- Run `npm run build` in frontend to catch any build errors

**Step 5.2 - Verify backend starts**
- Test backend starts correctly with env vars

**Step 5.3 - Seed production database**
- Run seed script to populate initial blog posts

---

## Deployment Steps (After Code Changes)

### 1. Set Up Neon Database
1. Go to https://neon.tech → Sign up (free)
2. Create a new project (e.g., "nihongo-next")
3. Copy the connection string: `postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`

### 2. Deploy Backend to Render
1. Go to https://render.com → Connect GitHub repo
2. Create a **Web Service**
3. Set root directory: `backend`
4. Build command: `npm install && npx prisma generate && npx prisma db push`
5. Start command: `node server.js`
6. Set environment variables:
   - `DATABASE_URL` = Neon connection string
   - `JWT_SECRET` = (generate a strong random secret)
   - `CORS_ORIGIN` = your Vercel URL (set after Vercel deploy)
   - `NODE_ENV` = production
7. Run seed: `npx prisma db seed` (one-time via Render shell)

### 3. Deploy Frontend to Vercel
1. Go to https://vercel.com → Import GitHub repo
2. Set root directory: `frontend`
3. Framework preset: Create React App
4. Set environment variable:
   - `REACT_APP_API_URL` = `https://your-render-service.onrender.com/api`
5. Deploy

### 4. Post-Deploy
1. Update Render `CORS_ORIGIN` with actual Vercel URL
2. Redeploy Render service
3. Run database seed via Render shell
4. Test all flows: blog list, blog post, register, login, comments

---

## File Changes Summary

| File | Action | Description |
|------|--------|-------------|
| `backend/package.json` | Modify | Add prisma, @prisma/client, helmet, express-rate-limit, dotenv |
| `backend/prisma/schema.prisma` | Create | Database schema |
| `backend/prisma/seed.js` | Create | Seed script for initial data |
| `backend/lib/prisma.js` | Create | Prisma client singleton |
| `backend/server.js` | Modify | Add dotenv, helmet, dynamic CORS, rate limiting |
| `backend/routes/auth.js` | Modify | Replace JSON file ops with Prisma queries |
| `backend/routes/posts.js` | Modify | Replace JSON file ops with Prisma queries |
| `backend/.env.example` | Create | Environment variable template |
| `frontend/src/config/api.js` | Create | API URL configuration |
| `frontend/src/pages/BlogListPage.jsx` | Modify | Use API config instead of hardcoded URL |
| `frontend/src/pages/BlogPostPage.jsx` | Modify | Use API config instead of hardcoded URL |
| `frontend/src/pages/SignUpPage.jsx` | Modify | Use API config instead of hardcoded URL |
| `frontend/src/pages/LoginPage.jsx` | Modify | Use API config instead of hardcoded URL |
| `frontend/.env.example` | Create | Environment variable template |
| `frontend/vercel.json` | Modify | Add SPA rewrites |
| `render.yaml` | Create | Render deployment blueprint |
| `.gitignore` | Modify | Add .env files if not already ignored |
