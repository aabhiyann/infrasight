from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.future import select
from typing import List

from db import get_session
from models import CostLog, User
from schemas import LogCreate, LogResponse, LogUpdate
from routes.auth import get_current_user

router = APIRouter()

# entry: uysed to validate; not for db
@router.post("/log")
async def create_log(entry: LogCreate, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    new_log = CostLog(
        date = entry.date,
        service = entry.service,
        amount = entry.amount
    )
    session.add(new_log)

    try:
        await session.commit()
        await session.refresh(new_log)
        return { 
            "message": "Log created",
            "id": new_log.id
        }
    except SQLAlchemyError as e:
        await session.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/logs", response_model=List[LogResponse])
async def read_logs(session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    try:
        result = await session.execute(select(CostLog))
        logs = result.scalars().all()
        return logs
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/log/{log_id}")
async def update_log(log_id: int, log_update: LogUpdate, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    try:
        result = await session.execute(select(CostLog).where(CostLog.id == log_id))
        log = result.scalar_one_or_none()
        
        if not log:
            raise HTTPException(status_code=404, detail="Log not found")
        
        # Update fields if provided
        if log_update.date is not None:
            log.date = log_update.date
        if log_update.service is not None:
            log.service = log_update.service
        if log_update.amount is not None:
            log.amount = log_update.amount
        if log_update.source is not None:
            log.source = log_update.source
        
        await session.commit()
        await session.refresh(log)
        return {"message": "Log updated successfully", "log": log}
        
    except SQLAlchemyError as e:
        await session.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/log/{log_id}")
async def delete_log(log_id: int, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    try:
        result = await session.execute(select(CostLog).where(CostLog.id == log_id))
        log = result.scalar_one_or_none()
        
        if not log:
            raise HTTPException(status_code=404, detail="Log not found")
        
        await session.delete(log)
        await session.commit()
        return {"message": "Log deleted successfully"}
        
    except SQLAlchemyError as e:
        await session.rollback()
        raise HTTPException(status_code=500, detail=str(e))