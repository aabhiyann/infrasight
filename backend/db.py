from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool
from dotenv import load_dotenv
import os

from models import Base

# Loading environment variables
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Creating Async Engine (Connection engine)
engine = create_async_engine(DATABASE_URL, echo=True, poolclass=NullPool)

# Creating Async Session Factory
AsyncSessionLocal = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

# Dependency for FastAPI routes
async def get_session():
    async with AsyncSessionLocal() as session:
        yield session