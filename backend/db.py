from sqlmodel import SQLModel
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine, AsyncEngine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.ext.declarative import DeclarativeMeta
from sqlalchemy.pool import NullPool
from sqlalchemy import text
from dotenv import load_dotenv
import os

# Loading secrets from the .env file
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Create Async Engine
engine: AsyncEngine = create_async_engine(DATABASE_URL, echo=True)

# Session Factory
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

# Calling this on startup to create all tables
async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)