from fastapi import FastAPI, HTTPException, Query
import json
import random
from pydantic import BaseModel
from typing import Optional
from datetime import date, timedelta
from routes import log, insights, mock_data


app = FastAPI()

app.include_router(log.router, prefix="/api")
app.include_router(insights.router, prefix="/api")
app.include_router(mock_data.router, prefix="/api")


