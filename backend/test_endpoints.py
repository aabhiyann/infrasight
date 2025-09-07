from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_forecast_ok():
    r = client.get("/api/forecast?n_days=7")
    assert r.status_code == 200
    body = r.json()
    assert "service_forecasts" in body
    assert "total_forecast" in body
    assert "summary" in body


def test_forecast_invalid_params():
    r = client.get("/api/forecast?n_days=0")
    assert r.status_code == 400


def test_services_list():
    r = client.get("/api/forecast/services")
    assert r.status_code == 200
    assert "services" in r.json()


def test_recommendations_with_budget():
    r = client.post("/api/recommendations?max_budget=100")
    assert r.status_code == 200
    assert "recommendations" in r.json()


def test_anomalies_ok():
    r = client.get("/api/anomalies?z_threshold=1.5")
    assert r.status_code == 200
    assert "anomalies" in r.json()


