from fastapi import FastAPI
from routes import log, insights, mock_data, clusters


app = FastAPI()

app.include_router(log.router, prefix="/api")
app.include_router(insights.router, prefix="/api")
app.include_router(mock_data.router, prefix="/api")
app.include_router(clusters.router, prefix="/api")



