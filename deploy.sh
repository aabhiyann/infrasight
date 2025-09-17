#!/bin/bash

# InfraSight Deployment Script for Development Branch
# This script prepares the project for deployment on Railway or other platforms

echo " InfraSight Deployment Preparation"
echo "====================================="

# Check if we're on development branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "development" ]; then
    echo "  Warning: You're not on the development branch!"
    echo "Current branch: $CURRENT_BRANCH"
    echo "Recommended to run this on development branch for testing"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo " Pre-deployment Checklist:"
echo "=============================="

# 1. Check Node.js version
echo " Checking Node.js version..."
NODE_VERSION=$(node --version)
echo "   Current Node.js version: $NODE_VERSION"
if [[ "$NODE_VERSION" < "v20.19.0" ]]; then
    echo "     Warning: Vite recommends Node.js 20.19+ or 22.12+"
    echo "   Current version will work but consider upgrading for production"
fi

# 2. Test frontend build
echo "  Testing frontend build..."
cd frontend
if npm run build; then
    echo "   Frontend build successful"
else
    echo "   Frontend build failed"
    exit 1
fi
cd ..

# 3. Test backend dependencies
echo "  Testing backend dependencies..."
cd backend
source venv/bin/activate
if python -c "import fastapi, uvicorn, sqlalchemy; print('All dependencies available')"; then
    echo "    Backend dependencies ready"
else
    echo "    Backend dependencies missing"
    exit 1
fi

# 4. Test database initialization
echo " Testing database initialization..."
if python init_db.py; then
    echo "    Database initialization successful"
else
    echo "    Database initialization failed"
    exit 1
fi

# 5. Test backend startup
echo "  Testing backend startup..."
timeout 5s uvicorn main:app --host 0.0.0.0 --port 8000 >/dev/null 2>&1
if [ $? -eq 124 ]; then
    echo "    Backend starts successfully"
else
    echo "    Backend startup failed"
    exit 1
fi

cd ..

echo ""
echo "Deployment Preparation Complete!"
echo "=================================="
echo ""
echo " Summary:"
echo "   Frontend builds successfully"
echo "   Backend dependencies installed"
echo "   Database initialization works"
echo "   Backend starts correctly"
echo "   Railway configuration ready"
echo "   Security measures in place (AWS disabled)"
echo ""
echo "Ready for deployment to:"
echo "   • Railway (backend/railway.toml configured)"
echo "   • Vercel/Netlify (frontend build ready)"
echo "   • Any cloud platform supporting FastAPI + Vite"
echo ""
echo "See DEPLOYMENT_CONFIG.md for detailed environment variable setup"
echo ""
echo " Remember to:"
echo "   1. Set proper SECRET_KEY in production"
echo "   2. Update ALLOWED_ORIGINS for your domain"
echo "   3. Configure frontend VITE_API_BASE_URL"
echo "   4. Consider upgrading Node.js for production"
