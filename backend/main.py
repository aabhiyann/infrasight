from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import asyncio
from routes import log, insights, mock_data, clusters, anomalies, forecasts, recommendations, ml_data, debug_visuals, auth, data_source
from db import engine
from models import Base
from contextlib import asynccontextmanager

# Database initialization function
async def init_database():
    """Initialize database tables on startup."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# Lifespan event handler for startup/shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize database
    if os.getenv("ENVIRONMENT") == "production":
        try:
            await init_database()
            print("✅ Database tables initialized successfully")
        except Exception as e:
            print(f"❌ Database initialization failed: {e}")
    yield
    # Shutdown: cleanup if needed
    pass

app = FastAPI(lifespan=lifespan)

# CORS configuration - flexible for development and production
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS", 
    "http://localhost:5173,http://localhost:5174,http://localhost:3000,https://*.vercel.app"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication routes
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])

# Protected API routes
app.include_router(log.router, prefix="/api")
app.include_router(insights.router, prefix="/api")
app.include_router(mock_data.router, prefix="/api")
app.include_router(clusters.router, prefix="/api")
app.include_router(anomalies.router, prefix="/api")
app.include_router(forecasts.router, prefix="/api")
app.include_router(recommendations.router, prefix="/api")
app.include_router(ml_data.router, prefix="/api")
app.include_router(debug_visuals.router, prefix="/api")
app.include_router(data_source.router, prefix="/api")

# Health check endpoint for deployment platforms
@app.get("/health")
def health_check():
    return {"status": "healthy", "message": "InfraSight API is running"}

@app.get("/")
def root():
    return {"message": "InfraSight API", "status": "online"}

# Admin endpoint to seed demo data (production only)
@app.post("/admin/seed-demo-data")
async def seed_demo_data():
    """Create demo users and data for production environment."""
    if os.getenv("ENVIRONMENT") != "production":
        return {"error": "This endpoint is only available in production"}
    
    try:
        from db import AsyncSessionLocal
        from models import User
        from auth_utils import get_password_hash
        from sqlalchemy import select
        
        async with AsyncSessionLocal() as session:
            # Check if users already exist
            result = await session.execute(select(User).where(User.email == "demo@infrasight.com"))
            if result.scalar_one_or_none():
                return {"message": "Demo users already exist", "status": "skipped"}

            # Create demo users
            demo_users = [
                {
                    "email": "demo@infrasight.com",
                    "username": "demo",
                    "password": "password123",
                    "is_admin": False
                },
                {
                    "email": "admin@infrasight.com", 
                    "username": "admin",
                    "password": "admin123",
                    "is_admin": True
                },
                {
                    "email": "test@infrasight.com",
                    "username": "testuser", 
                    "password": "test123",
                    "is_admin": False
                }
            ]

            for user_data in demo_users:
                user = User(
                    email=user_data["email"],
                    username=user_data["username"],
                    hashed_password=get_password_hash(user_data["password"]),
                    is_admin=user_data["is_admin"]
                )
                session.add(user)

            await session.commit()
            return {
                "message": "Demo users created successfully",
                "users": ["demo@infrasight.com", "admin@infrasight.com", "test@infrasight.com"],
                "status": "success"
            }
            
    except Exception as e:
        return {"error": f"Failed to create demo users: {str(e)}", "status": "failed"}
