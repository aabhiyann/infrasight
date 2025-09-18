# InfraSight

InfraSight is a cloud cost intelligence dashboard that uses mock billing data and machine learning to help developers and teams understand, visualize, and optimize their cloud spending.

**WARNING: AWS ACCESS DISABLED**: This application now uses ONLY mock data to prevent unexpected AWS charges.

## 🚀 Live Demo

**Experience InfraSight in action:**
- **Frontend:** [https://infrasight.netlify.app](https://infrasight.netlify.app)
- **Backend API:** [https://infrasight-rs1b.onrender.com](https://infrasight-rs1b.onrender.com)
- **API Documentation:** [https://infrasight-rs1b.onrender.com/docs](https://infrasight-rs1b.onrender.com/docs)

**Demo Credentials:**
- Email: `demo@infrasight.com` | Password: `password123`
- Email: `admin@infrasight.com` | Password: `admin123`
- Email: `test@infrasight.com` | Password: `test123`

## What It Does

- Uses mock cost and usage data (AWS access disabled for safety)
- Shows cost breakdown by service over time
- Uses ML to detect waste and forecast future spend
- Offers savings recommendations
- Presents all insights in a sleek, interactive frontend dashboard

## Tech Stack

| Layer        | Tech                          |
| ------------ | ----------------------------- |
| Frontend     | React 19, Vite, TypeScript    |
| Backend      | FastAPI, Python 3.11          |
| Cloud Access | Mock Data Only (AWS disabled) |
| ML Engine    | pandas, scikit-learn          |
| Database     | PostgreSQL (Neon.tech)        |
| Deployment   | Docker, Netlify, Render       |
| Infrastructure | Cloud-native, Auto-scaling   |

## Quick Start with Docker

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- Git

### 1. Clone and Setup

```bash
git clone https://github.com/YOUR_USERNAME/infrasight.git
cd infrasight

# Copy environment file and customize if needed
cp env.example .env
```

### 2. Launch with Docker (Recommended)

```bash
# Start all services (backend + frontend + database)
docker-compose -f docker-compose.local.yml up --build

# Or run in background
docker-compose -f docker-compose.local.yml up --build -d
```

The application is now running and accessible.

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Database**: localhost:5432

### 3. Initialize Database & Demo Users

```bash
# Create database tables and demo users
docker compose -f docker-compose.local.yml exec backend python seed_demo_data.py
```

**Demo Accounts:**

- **Regular User**: `demo@infrasight.com` / `password123`
- **Admin User**: `admin@infrasight.com` / `admin123`
- **Test User**: `test@infrasight.com` / `test123`

### 4. Stop Services

```bash
# Stop all services
docker-compose -f docker-compose.local.yml down

# Stop and remove volumes (clears database)
docker-compose -f docker-compose.local.yml down -v
```

## Development Setup (Manual)

If you prefer to run services individually:

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Database Setup

```bash
# Run PostgreSQL with Docker
docker run --name infrasight-db \
  -e POSTGRES_USER=infrasight \
  -e POSTGRES_PASSWORD=infrasight_password \
  -e POSTGRES_DB=infrasight \
  -p 5432:5432 \
  -d postgres:15-alpine
```

## Cloud Deployment

### Option 1: All-in-One Docker Deployment

- **Render**: Deploy `backend/Dockerfile` directly
- **Railway**: Deploy `backend/Dockerfile` with PostgreSQL addon
- **Fly.io**: Deploy using `backend/Dockerfile`

### Option 2: Separate Service Deployment (✅ CURRENTLY DEPLOYED)

- **Frontend**: [Netlify](https://netlify.com) - Static site hosting with CDN
- **Backend**: [Render](https://render.com) - Docker container hosting  
- **Database**: [Neon.tech](https://neon.tech) - Managed PostgreSQL

### 🌐 Live Production Infrastructure

**Current Deployment Status:**
- ✅ **Auto-deployment** from Git pushes
- ✅ **HTTPS/SSL** certificates (automatic)
- ✅ **CDN** for global performance
- ✅ **Database backups** and monitoring
- ✅ **Health checks** and uptime monitoring
- ✅ **Environment variables** management

### Environment Variables for Production

Update your `.env` file or cloud platform environment variables:

```bash
# Database (use your cloud database URL)
DATABASE_URL=postgresql://username:password@hostname:port/database

# Security (generate a secure secret key)
SECRET_KEY=your-production-secret-key-here
DEBUG=false
ENVIRONMENT=production

# CORS (use your actual frontend domain)
ALLOWED_ORIGINS=https://your-frontend-domain.com
```

## Architecture
