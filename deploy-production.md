# InfraSight Production Deployment Guide

This guide walks you through deploying InfraSight to production using modern cloud platforms.

## Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Netlify       │    │     Render       │    │   Neon.tech     │
│   (Frontend)    │────│   (Backend)      │────│  (Database)     │
│   React App     │    │   FastAPI API    │    │  PostgreSQL     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Step 1: Database Setup (Neon.tech)

### 1.1 Create Account

1. Go to https://neon.tech
2. Sign up with GitHub (free tier: 10GB storage)
3. Create new project: "InfraSight"

### 1.2 Get Connection String

Copy your connection string (looks like):

```
postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### 1.3 Initialize Database

```bash
# Update your .env with Neon connection string
DATABASE_URL=postgresql+asyncpg://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require

# Test connection locally first
docker compose -f docker-compose.local.yml exec backend python init_db.py
docker compose -f docker-compose.local.yml exec backend python seed_demo_data.py
```

## Step 2: Backend Deployment (Render)

### 2.1 Create Render Account

1. Go to https://render.com
2. Sign up with GitHub
3. Connect your InfraSight repository

### 2.2 Create Web Service

1. **New** → **Web Service**
2. **Connect** your GitHub repo
3. **Configuration**:
   - **Name**: `infrasight-backend`
   - **Region**: `Oregon (US West)`
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Docker`
   - **Instance Type**: `Free`

### 2.3 Environment Variables

Add these in Render dashboard:

```bash
DATABASE_URL=postgresql+asyncpg://your-neon-connection-string
SECRET_KEY=your-super-secure-secret-key-generate-new-one
ALLOWED_ORIGINS=https://your-netlify-app.netlify.app
DEBUG=false
ENVIRONMENT=production
```

### 2.4 Generate Secret Key

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

## 🌐 Step 3: Frontend Deployment (Netlify)

### 3.1 Prepare Frontend

Update `frontend/src/api/` files to use production backend URL:

```typescript
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://your-render-app.onrender.com"
    : "http://localhost:8000";
```

### 3.2 Deploy to Netlify

1. Go to https://netlify.com
2. **New site from Git**
3. Connect GitHub repo
4. **Configuration**:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

### 3.3 Environment Variables (Netlify)

```bash
REACT_APP_API_URL=https://your-render-app.onrender.com
```

## ✅ Step 4: Final Configuration

### 4.1 Update CORS

Update `ALLOWED_ORIGINS` in Render:

```bash
ALLOWED_ORIGINS=https://your-netlify-app.netlify.app,https://infrasight.netlify.app
```

### 4.2 Initialize Production Database

```bash
# Run these commands via Render console or API
python init_db.py
python seed_demo_data.py
```

## 🎯 Final URLs

After deployment:

- **Frontend**: https://your-app.netlify.app
- **Backend**: https://your-app.onrender.com
- **API Docs**: https://your-app.onrender.com/docs

## 📋 Demo Accounts

Production demo accounts:

- **User**: demo@infrasight.com / password123
- **Admin**: admin@infrasight.com / admin123

## 🔧 Troubleshooting

### Common Issues:

1. **Database Connection**: Check Neon connection string format
2. **CORS Errors**: Verify ALLOWED_ORIGINS includes Netlify URL
3. **Build Failures**: Check Node.js version compatibility

### Health Checks:

- Backend: https://your-app.onrender.com/health
- Database: Check Neon dashboard for connections

## 🚀 Success!

Your InfraSight application is now live and ready for recruiters!
