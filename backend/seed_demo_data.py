#!/usr/bin/env python3
"""
Seed script for InfraSight development database.
Creates demo users and sample data for development/testing.
"""
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from db import AsyncSessionLocal, engine
from models import Base, User
from auth_utils import get_password_hash

async def create_demo_users():
    """Create demo users for development."""
    async with AsyncSessionLocal() as session:
        # Check if users already exist
        result = await session.execute(select(User).where(User.email == "demo@infrasight.com"))
        if result.scalar_one_or_none():
            print("Demo users already exist. Skipping user creation.")
            return

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
            print(f"Created user: {user_data['email']} (admin: {user_data['is_admin']})")

        await session.commit()
        print("✅ Demo users created successfully!")

async def seed_database():
    """Initialize database and create demo data."""
    print("🗄️ Initializing database tables...")
    
    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("✅ Database tables created!")
    
    # Create demo users
    print("👥 Creating demo users...")
    await create_demo_users()
    
    print("\n🎉 Database seeding complete!")
    print("\n📋 Demo Accounts:")
    print("  Regular User: demo@infrasight.com / password123")
    print("  Admin User:   admin@infrasight.com / admin123") 
    print("  Test User:    test@infrasight.com / test123")

if __name__ == "__main__":
    asyncio.run(seed_database())
