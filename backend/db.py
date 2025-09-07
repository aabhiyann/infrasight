from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool
from dotenv import load_dotenv
import os

from models import Base

# Loading environment variables
load_dotenv()

# Default to local sqlite for tests/CI if env var is missing
DATABASE_URL = os.getenv("DATABASE_URL") or "sqlite+aiosqlite:///./test.db"

# Creating Async Engine (Connection engine)
engine = create_async_engine(DATABASE_URL, echo=False, poolclass=NullPool)

# Creating Async Session Factory
AsyncSessionLocal = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

# Dependency for FastAPI routes
async def get_session():
    async with AsyncSessionLocal() as session:
        yield session