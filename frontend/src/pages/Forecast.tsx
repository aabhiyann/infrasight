// src/pages/Forecast.tsx
import React, { useEffect, useState } from "react";
import { fetchForecastData, type ForecastResponse } from "../api/forecastApi";
import ForecastChart from "../components/ForecastChart";

const Forecast: React.FC = () => {
  const [forecastData, setForecastData] = useState<ForecastResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const result = await fetchForecastData();
        setForecastData(result);
      } catch (error) {
        console.error("Failed to load forecast data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div>
      <h2>Cost Forecasts</h2>
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
};

export default Forecast;
