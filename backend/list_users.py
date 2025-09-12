#!/usr/bin/env python3
"""
Simple script to list all users in the database
"""
import asyncio
import sys
import os

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from db import AsyncSessionLocal
from models import User
from sqlalchemy import select

async def list_all_users():
    """List all users in the database"""
    async with AsyncSessionLocal() as session:
        try:
            # Query all users
            result = await session.execute(select(User))
            users = result.scalars().all()
            
            if not users:
                print("No users found in the database.")
                return
            
            print(f"Found {len(users)} user(s) in the database:")
            print("-" * 80)
            
            for user in users:
                print(f"ID: {user.id}")
                print(f"Email: {user.email}")
                print(f"Username: {user.username}")
                print(f"Active: {user.is_active}")
                print(f"Admin: {user.is_admin}")
                print(f"Created: {user.created_at}")
                print(f"Updated: {user.updated_at}")
                print("-" * 80)
                
        except Exception as e:
            print(f"Error querying database: {e}")

if __name__ == "__main__":
    asyncio.run(list_all_users())
