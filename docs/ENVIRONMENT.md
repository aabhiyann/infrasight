# Environment Configuration

This guide shows example environment variables for both backend and frontend. Copy these into your hosting provider or local `.env` files.

## Backend (.env)

```
# Environment
ENV=development

# Security
# Generate a strong key:
#   python -c "import secrets; print(secrets.token_hex(32))"
SECRET_KEY=replace-with-64-hex-characters

# CORS - comma-separated list of allowed frontend origins
ALLOWED_ORIGINS=http://localhost:5173

# Database
# Dev (SQLite):
DATABASE_URL=sqlite+aiosqlite:///./dev.db
# Prod (Postgres example):
# DATABASE_URL=postgresql+asyncpg://user:password@host:5432/infrasight

# AWS (optional, only if using real data)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1

# Data source selection
USE_REAL_DATA=false
```

## Frontend (.env)

```
# Point the frontend to your backend API base URL
# Dev:
VITE_API_URL=http://localhost:8000
# Prod example:
# VITE_API_URL=https://api.example.com
```

Notes:

- In production, set `ENV=production` and ensure `SECRET_KEY` is a strong value.
- Keep `.env` files out of version control; use these examples to set values in your hosting environment.
