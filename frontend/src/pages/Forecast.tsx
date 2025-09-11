import { useEffect, useState } from "react";
import {
  fetchForecastData,
  fetchAvailableServices,
  type ForecastResponse,
} from "../api/forecastApi";
import ForecastChart from "../components/ForecastChart";
import ServiceSelector from "../components/ServiceSelector";

const Forecast = () => {
  const [forecastData, setForecastData] = useState<ForecastResponse | null>(
    null
  );
  const [availableServices, setAvailableServices] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const services = await fetchAvailableServices();
        setAvailableServices(services);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      }
    }
    loadInitialData();
  }, []);

  useEffect(() => {
    async function loadForecast() {
      try {
        setLoading(true);
        const result = await fetchForecastData(7, selectedService || undefined);
        setForecastData(result);
        // Fallback: if services list is empty, derive from forecast response
        if (availableServices.length === 0 && result) {
          const keys = Object.keys(result.service_forecasts || {});
          if (keys.length > 0) {
            setAvailableServices(keys);
          }
        }
      } catch (error) {
        console.error("Failed to load forecast data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadForecast();
  }, [selectedService]);

  return (
    <div className="container">
      <h2>Cost Forecasts</h2>
      <ServiceSelector
        services={availableServices}
        selectedService={selectedService}
        onChange={setSelectedService}
      />

      {loading ? (
        <p>Loading forecast data...</p>
      ) : !forecastData ? (
        <p>No forecast data available.</p>
      ) : (
        <>
          {selectedService ? (
            <ForecastChart
              data={forecastData.service_forecasts[selectedService] || []}
              service={selectedService}
            />
          ) : (
            <>
              <ForecastChart
                data={forecastData.total_forecast}
                service="Total Cost"
              />
              {Object.entries(forecastData.service_forecasts).map(
                ([service, forecast]) => (
                  <ForecastChart
                    key={service}
                    data={forecast}
                    service={service}
                  />
                )
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Forecast;
