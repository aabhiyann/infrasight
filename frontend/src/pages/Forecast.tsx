import React, { useEffect, useState } from "react";
import {
  fetchForecastData,
  fetchAvailableServices,
  type ForecastResponse,
} from "../api/forecastApi";
import ForecastChart from "../components/ForecastChart";

function Forecast() {
  const [forecastData, setForecastData] = useState<ForecastResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState<string | undefined>(
    undefined
  );

  // Load available services once
  useEffect(() => {
    (async () => {
      const svc = await fetchAvailableServices();
      setServices(svc);
    })();
  }, []);

  // Load forecast whenever selected service changes
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const result = await fetchForecastData(7, selectedService);
        setForecastData(result);
      } catch (error) {
        console.error("Failed to load forecast data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedService]);

  return (
    <div className="container">
      <h2>Cost Forecasts</h2>
      {/* Service Filter */}
      {services.length > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="service-select" style={{ marginRight: 8 }}>
            Service:
          </label>
          <select
            id="service-select"
            value={selectedService ?? ""}
            onChange={(e) =>
              setSelectedService(e.target.value ? e.target.value : undefined)
            }
          >
            <option value="">All Services</option>
            {services.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      )}
      {loading ? (
        <p>Loading forecast data...</p>
      ) : !forecastData ? (
        <p>No forecast data available.</p>
      ) : (
        <>
          {/* Total Forecast */}
          <ForecastChart
            data={forecastData.total_forecast}
            service="Total Cost"
          />

          {/* Service-specific Forecasts */}
          {Object.entries(forecastData.service_forecasts).map(
            ([service, forecast]) => (
              <ForecastChart key={service} data={forecast} service={service} />
            )
          )}
        </>
      )}
    </div>
  );
}

export default Forecast;
