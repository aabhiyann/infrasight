from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSesion
from sqlalchemy.ext import SQLAlechemyError

from db import get_session
from models import CostLog
from schemas import LogCreate

router = APIRouter()

@router.post("/log")
async def create_log(entry: LogCreate, session: AsyncSesion = Depends(get_session)):
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
