import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAnomalyApi, type Anomaly } from "../api/anomalyApi";
import { useDataSource } from "../contexts/DataSourceContext";
import AnomalyScatterPlotChartJS from "../components/AnomalyScatterPlotChartJS";
import AnomalyTable from "../components/AnomalyTable";
import ServiceFilterDropdown from "../components/ServiceFilterDropdown";
import DateRangePicker, { type DateRange } from "../components/DateRangePicker";
import Skeleton from "../components/Skeleton";
import EmptyState from "../components/EmptyState";
import { usePageTitle } from "../hooks/usePageTitle";
import { useToast } from "../components/ui/Toast";

const Anomalies = () => {
  usePageTitle("Anomalies");
  const { fetchAnomalies } = useAnomalyApi();
  const { dataSource, loading: dataSourceLoading } = useDataSource();
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [fullAnomalies, setFullAnomalies] = useState<Anomaly[]>([]); // Store full dataset for date range calculation
  const [filtered, setFiltered] = useState<Anomaly[]>([]);
  const [selectedService, setSelectedService] = useState("");
  const [loading, setLoading] = useState(true);
  const [zThreshold, setZThreshold] = useState<number>(2.0);
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    end: new Date(),
  });

  // Calculate available data range for adaptive DateRangePicker using FULL dataset
  const availableDataRange =
    fullAnomalies.length > 0
      ? {
          start: new Date(
            Math.min(...fullAnomalies.map((a) => new Date(a.date).getTime()))
          ),
          end: new Date(
            Math.max(...fullAnomalies.map((a) => new Date(a.date).getTime()))
          ),
        }
      : undefined;
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const { notify } = useToast();

  useEffect(() => {
    async function loadData() {
      // Don't load data if data source is still loading
      if (dataSourceLoading) {
        console.log(
          "Anomalies page - data source still loading, skipping data fetch"
        );
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // First, fetch ALL anomalies to calculate available date range
        const fullResult = await fetchAnomalies(zThreshold, {});
        setFullAnomalies(fullResult);

        // Then filter the full anomalies by the selected date range
        const filteredResult = fullResult.filter((anomaly) => {
          const anomalyDate = new Date(anomaly.date);
          return anomalyDate >= dateRange.start && anomalyDate <= dateRange.end;
        });

        setAnomalies(filteredResult);
        setLastRefresh(new Date());
        setLoading(false);
        if (filteredResult.length === 0) {
          setError(
            "No anomalies returned. Try lowering the Z-threshold or expanding the date range."
          );
        }
        notify("Anomalies refreshed", "success", 1800);
      } catch (error) {
        console.error("Error loading anomalies:", error);
        setError("Failed to load anomalies. Please try again.");
        setLoading(false);
      }
    }
    loadData();
  }, [zThreshold, dataSource, dateRange, dataSourceLoading]); // Reload when data source or date range changes

  useEffect(() => {
    if (!selectedService) {
      setFiltered(anomalies);
    } else {
      setFiltered(anomalies.filter((a) => a.service === selectedService));
    }
  }, [selectedService, anomalies]);

  // Read initial filters from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const service = params.get("service") || "";
    const z = params.get("z") || "";
    if (service) setSelectedService(service);
    if (z) setZThreshold(parseFloat(z) || 2.0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync filters to URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (selectedService) params.set("service", selectedService);
    else params.delete("service");
    params.set("z", String(zThreshold));
    navigate({ search: params.toString() }, { replace: true });
  }, [selectedService, zThreshold, location.search, navigate]);

  return (
    <div className="container stack-lg">
      <div className="page-header">
        <h2 className="page-title">Detected Anomalies</h2>
        <p className="page-subtitle">
          Unusual spend spikes and outliers across services.
        </p>
      </div>
      <div className="toolbar">
        <div className="d-flex items-center gap-md">
          <label htmlFor="service">Service:</label>
          <ServiceFilterDropdown
            selected={selectedService}
            onChange={setSelectedService}
          />
        </div>
        <div className="d-flex items-center gap-md">
          <label htmlFor="date-range">Date Range:</label>
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
            availableDataRange={availableDataRange}
          />
        </div>
        <div className="d-flex items-center gap-sm ml-auto">
          <label htmlFor="z-threshold" className="text-sm">
            Z-Threshold:
          </label>
          <input
            id="z-threshold"
            type="number"
            step="0.1"
            min={1.0}
            max={5.0}
            value={zThreshold}
            onChange={(e) => setZThreshold(parseFloat(e.target.value) || 0)}
            className="w-20 input"
          />
        </div>
        <div className="text-sm ml-auto">
          <span className="hide-sm-text">Last updated: </span>
          {lastRefresh.toLocaleTimeString()}
        </div>
      </div>
      {loading ? (
        <div className="card">
          <Skeleton height={300} />
        </div>
      ) : error ? (
        <div className="card">
          <EmptyState
            title="Error loading anomalies"
            message={error}
            icon="alert"
            onRetry={() => {
              setError(null);
              setLoading(true);
              // Trigger reload
              const current = zThreshold;
              setZThreshold(0);
              setTimeout(() => setZThreshold(current), 100);
            }}
          />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            title="No anomalies found"
            message="Try adjusting the Z-threshold or service filter."
            icon="alert"
          />
        </div>
      ) : (
        <>
          <div className="card">
            <AnomalyScatterPlotChartJS anomalies={filtered} />
          </div>
          <AnomalyTable anomalies={filtered} />
        </>
      )}
    </div>
  );
};

export default Anomalies;
