#!/bin/bash

# InfraSight Backend Deployment Script for Render
# This script helps prepare the backend for deployment to Render.com

set -e  # Exit on any error

echo "Preparing InfraSight Backend for Render Deployment"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "backend/Dockerfile" ]; then
    echo "Error: Please run this script from the project root directory"
    exit 1
fi

echo "Found backend/Dockerfile"

# Check if required files exist
if [ ! -f "backend/requirements.txt" ]; then
    echo "Error: backend/requirements.txt not found"
    exit 1
fi

if [ ! -f "backend/main.py" ]; then
    echo "Error: backend/main.py not found"
    exit 1
fi

echo "All required files found"

# Validate Dockerfile
echo "🔍 Validating Dockerfile..."
if docker build --dry-run ./backend > /dev/null 2>&1; then
    echo "Dockerfile validation passed"
else
    echo "Dockerfile validation failed"
    exit 1
fi

echo ""
echo "Deployment Instructions for Render:"
echo "======================================"
echo ""
echo "1. Go to https://render.com and create a new Web Service"
echo "2. Connect your GitHub repository"
echo "3. Configure the service:"
echo "   - Name: infrasight-backend"
echo "   - Region: Choose closest to your users"
echo "   - Branch: main (or your deployment branch)"
echo "   - Root Directory: backend"
echo "   - Runtime: Docker"
echo "   - Build Command: (leave empty - Docker handles this)"
echo "   - Start Command: (leave empty - Docker handles this)"
echo ""
echo "4. Add Environment Variables:"
echo "   DATABASE_URL=postgresql://username:password@hostname:port/database"
echo "   SECRET_KEY=your-secure-secret-key"
echo "   ALLOWED_ORIGINS=https://your-frontend-domain.com"
echo "   DEBUG=false"
echo "   ENVIRONMENT=production"
echo ""
echo "5. For the database, use Render's PostgreSQL add-on or external service like:"
echo "   - Neon.tech (free tier)"
echo "   - Supabase (free tier)"
echo "   - Render PostgreSQL (paid)"
echo ""
echo "6. Deploy and test at: https://your-service-name.onrender.com/docs"
echo ""
echo "💡 Pro Tips:"
echo "- Use Render's free tier for demos (spins down after inactivity)"
echo "- Upgrade to paid tier for production (always-on)"
echo "- Set up health checks at /health endpoint"
echo "- Monitor logs in Render dashboard"
echo ""
echo "🔗 Useful Links:"
echo "- Render Docs: https://render.com/docs/web-services"
echo "- Docker on Render: https://render.com/docs/docker"
echo ""
echo "Backend is ready for deployment."
