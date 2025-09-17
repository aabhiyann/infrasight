# InfraSight

InfraSight is a cloud cost intelligence dashboard that uses mock billing data and machine learning to help developers and teams understand, visualize, and optimize their cloud spending.

**WARNING: AWS ACCESS DISABLED**: This application now uses ONLY mock data to prevent unexpected AWS charges.

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
| Database     | PostgreSQL                    |
| Deployment   | Docker, Netlify, Render       |

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

### 3. Stop Services

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

### Option 2: Separate Service Deployment

- **Frontend**: Deploy to Netlify (automatic builds from Git)
- **Backend**: Deploy to Render using Docker
- **Database**: Use Neon.tech or Supabase (free PostgreSQL)

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
