import ChartCard from "../components/ChartCard";
import EmptyState from "../components/EmptyState";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  fetchForecastData,
  fetchAvailableServices,
  type ForecastResponse,
} from "../api/forecastApi";
import ForecastChart from "../components/ForecastChart";
import ServiceFilterDropdown from "../components/ServiceFilterDropdown";
import ChartSkeleton from "../components/ChartSkeleton";
import ErrorBoundary from "../components/ErrorBoundary";
import { RefreshCw } from "lucide-react";
import { usePageTitle } from "../hooks/usePageTitle";

const Forecast = () => {
  usePageTitle("Forecast");
  const [forecastData, setForecastData] = useState<ForecastResponse | null>(
    null
  );
  const [availableServices, setAvailableServices] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const loadForecast = async () => {
    try {
      setError(null);
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
    } catch (err) {
      setError("Failed to load forecast data. Please try again.");
      console.error("Failed to load forecast data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadForecast();
  }, [selectedService]);

  // URL sync
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const service = params.get("service") || "";
    if (service) setSelectedService(service);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (selectedService) params.set("service", selectedService);
    else params.delete("service");
    navigate({ search: params.toString() }, { replace: true });
  }, [selectedService, location.search, navigate]);

  return (
    <div className="container stack-lg">
      <div className="page-header">
        <h2 className="page-title">Cost Forecasts</h2>
        <p className="page-subtitle">
          Predictions and confidence bounds for total and per-service costs.
        </p>
      </div>
      <div className="toolbar">
        <label htmlFor="service">Service:</label>
        <ServiceFilterDropdown
          selected={selectedService}
          onChange={setSelectedService}
        />
        <button
          onClick={loadForecast}
          disabled={loading}
          className="btn btn-secondary d-flex items-center gap-sm"
          aria-label={loading ? "Refreshing" : "Refresh"}
          title={loading ? "Refreshing" : "Refresh"}
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          <span className="hide-sm-text">
            {loading ? "Refreshing..." : "Refresh"}
          </span>
        </button>
      </div>

      {loading ? (
        <div className="card">
          <ChartSkeleton type="area" height={280} showLegend />
        </div>
      ) : error ? (
        <div className="card">
          <EmptyState
            title="Error loading forecast"
            message={error}
            icon="alert"
            onRetry={loadForecast}
          />
        </div>
      ) : !forecastData ? (
        <div className="card">
          <EmptyState
            title="No forecast data"
            message="Try adjusting filters or check back later."
            icon="refresh"
            onRetry={loadForecast}
          />
        </div>
      ) : (
        <ErrorBoundary>
          {selectedService ? (
            <ChartCard title={selectedService}>
              <ForecastChart
                data={forecastData.service_forecasts[selectedService] || []}
                service={selectedService}
                hideTitle
              />
            </ChartCard>
          ) : (
            <>
              <ChartCard title="Total Cost">
                <ForecastChart
                  data={forecastData.total_forecast}
                  service="Total Cost"
                  hideTitle
                />
              </ChartCard>
              {Object.entries(forecastData.service_forecasts).map(
                ([service, forecast]) => (
                  <ChartCard title={service} key={service}>
                    <ForecastChart
                      data={forecast}
                      service={service}
                      hideTitle
                    />
                  </ChartCard>
                )
              )}
            </>
          )}
        </ErrorBoundary>
      )}
    </div>
  );
};

export default Forecast;
