from pydantic import BaseModel
from datetime import date
from typing import List, Dict, Any

# For validating user input when request hits the api, not DB
class LogCreate(BaseModel):
    date: date
    service: str
    amount: float

class LogResponse(BaseModel):
    id: int
    date: date
    service: str
    amount: float

# This tells Pydantic to read from SQLAlchemy objects
    class Config:
        from_attributes = True

# Anomaly detection response schemas
class AnomalyPoint(BaseModel):
    service: str
    date: date
    amount: float
    z_score: float

class AnomalySummary(BaseModel):
    total_anomalies: int
    services_affected: int
    services: List[str]

class AnomalyResponse(BaseModel):
    anomalies: Dict[str, List[Dict[str, Any]]]
    flattened_anomalies: List[AnomalyPoint]
    summary: AnomalySummary
    threshold_used: float
    status: str

class ThresholdSummary(BaseModel):
    total_anomalies: int
    services_affected: int
    services: List[str]

class AnomalySummaryResponse(BaseModel):
    threshold_summary: Dict[str, ThresholdSummary]
    status: str

# Forecasting response schemas
class ForecastPoint(BaseModel):
    date: str
    predicted_cost: float
    confidence_lower: float
    confidence_upper: float
    confidence_interval: float

class ForecastSummary(BaseModel):
    total_forecast_cost: float
    average_daily_cost: float
    forecast_period_days: int
    services_forecasted: int
    services: List[str]

class ForecastResponse(BaseModel):
    service_forecasts: Dict[str, List[ForecastPoint]]
    total_forecast: List[ForecastPoint]
    summary: ForecastSummary
    status: str
