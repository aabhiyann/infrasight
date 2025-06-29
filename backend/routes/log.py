from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.future import select
from typing import List

from db import get_session
from models import CostLog
from schemas import LogCreate, LogResponse

router = APIRouter()

# entry: uysed to validate; not for db
@router.post("/log")
async def create_log(entry: LogCreate, session: AsyncSession = Depends(get_session)):
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
    except SQLAlechemyError as e:
        await session.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/logs", response_model=List[LogResponse])
async def read_logs(session: AsyncSession = Depends(get_session)):
    try:
        result = await session.execute(select(CostLog))
        logs = result.scalars().all()
        return logs
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=str(e))