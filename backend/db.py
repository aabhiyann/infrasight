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
# Enforce SSL for providers like Neon when using asyncpg
import ssl
ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE
engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    poolclass=NullPool,
    connect_args={"ssl": ssl_context},
)

# Creating Async Session Factory
AsyncSessionLocal = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

# Dependency for FastAPI routes
async def get_session():
    async with AsyncSessionLocal() as session:
        yield session