from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSesion
from sqlalchemy.ext import SQLAlechemyError

from db import get_session
from models import CostLog
from schemas import LogCeate

router = APIRouter()

@router.post("/log")
async def create_log(entry: LogCreate, session: AsyncSesion = Depends(get_session)):
    new_log = CostLog(
        date = entry.date,
        service = entry.service,
        amount = entry.amount
    )
    session.add(new_log)