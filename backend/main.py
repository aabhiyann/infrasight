from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import log, insights, mock_data, clusters, anomalies, forecasts, recommendations, ml_data, debug_visuals
import os


app = FastAPI()

# CORS configuration - flexible for development and production
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS", 
    "http://localhost:5173,http://localhost:5174,http://localhost:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(log.router, prefix="/api")
app.include_router(insights.router, prefix="/api")
app.include_router(mock_data.router, prefix="/api")
app.include_router(clusters.router, prefix="/api")
app.include_router(anomalies.router, prefix="/api")
app.include_router(forecasts.router, prefix="/api")
app.include_router(recommendations.router, prefix="/api")
app.include_router(ml_data.router, prefix="/api")
app.include_router(debug_visuals.router, prefix="/api")



