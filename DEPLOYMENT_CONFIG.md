# InfraSight Deployment Configuration Guide

## Environment Variables Required for Deployment

### Backend Environment Variables

Set these in your deployment platform (Railway, Vercel, etc.):

```bash
# Data Source Configuration
USE_REAL_DATA=false

# Database Configuration
DATABASE_URL=sqlite+aiosqlite:///./infrasight.db

# Security Configuration
SECRET_KEY=your-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS Configuration
ALLOWED_ORIGINS=https://your-frontend-domain.com,http://localhost:5173

# Port Configuration (set by platform, usually automatic)
PORT=$PORT

# Python Path (for deployment)
PYTHONPATH=/app

# Logging Configuration
LOG_LEVEL=INFO
```

### Frontend Environment Variables

Set these in your frontend deployment:

```bash
# API Base URL (update to your backend deployment URL)
VITE_API_BASE_URL=https://your-backend-domain.com/api

# App Environment
VITE_ENV=production
```

## Railway Deployment Configuration

The current `railway.toml` is configured for:

- Mock data only (safe for deployment)
- Health check endpoint at `/health`
- Automatic port assignment
- Nixpacks builder

## Deployment Checklist

### Backend Deployment Ready

- [x] Dependencies properly defined in requirements.txt
- [x] Database initialization script working
- [x] Health check endpoint functional
- [x] Mock data working correctly
- [x] CORS configured for production
- [x] Railway configuration file ready

### Frontend Deployment Ready

- [x] Build process working (with Node.js version warning)
- [x] TypeScript errors resolved
- [x] Production build creates optimized bundle

### Security Measures

- [x] AWS credentials removed to prevent charges
- [x] Mock data only in USE_REAL_DATA environment variable
- [x] No real AWS API calls possible

## Node.js Version Note

Current version 20.18.0 works but Vite recommends 20.19+ or 22.12+. Consider upgrading for production deployment.

## Database Strategy

Currently using SQLite with async support. For production scale, consider:

- PostgreSQL on Railway
- Proper database migrations
- Connection pooling
