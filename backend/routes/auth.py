from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import timedelta
from typing import Optional

from db import get_session
from models import User
from schemas import UserCreate, UserLogin, UserResponse, Token
from auth_utils import (
    verify_password, 
    get_password_hash, 
    create_access_token, 
    ACCESS_TOKEN_EXPIRE_MINUTES
)
from dependencies import get_current_user

router = APIRouter()

async def get_user_by_email(session: AsyncSession, email: str) -> Optional[User]:
    """Get user by email from database."""
    result = await session.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()

@router.post("/signup", response_model=UserResponse)
async def signup(user_data: UserCreate, session: AsyncSession = Depends(get_session)):
    """Register a new user."""
    # Check if user already exists
    existing_user = await get_user_by_email(session, user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check if username already exists
    result = await session.execute(select(User).where(User.username == user_data.username))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    user = User(
        email=user_data.email,
        username=user_data.username,
        hashed_password=hashed_password
    )
    
    session.add(user)
    await session.commit()
    await session.refresh(user)
    
    return user

@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin, session: AsyncSession = Depends(get_session)):
    """Authenticate user and return JWT token."""
    user = await get_user_by_email(session, user_credentials.email)
    
    if not user or not verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information."""
    return current_user

@router.post("/logout")
async def logout():
    """Logout user (client should discard token)."""
    return {"message": "Successfully logged out"}

@router.get("/verify-token")
async def verify_token_endpoint(current_user: User = Depends(get_current_user)):
    """Verify if token is valid."""
    return {"valid": True, "user_id": current_user.id}
