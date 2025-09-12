import { useEffect, useState } from "react";
import { fetchAnomalies, type Anomaly } from "../api/anomalyApi";
import AnomalyScatterPlot from "../components/AnomalyScatterPlot";
import AnomalyTable from "../components/AnomalyTable";
import ServiceFilterDropdown from "../components/ServiceFilterDropdown";
import Breadcrumb from "../components/Breadcrumb";
import Skeleton from "../components/Skeleton";
import EmptyState from "../components/EmptyState";

const Anomalies = () => {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [filtered, setFiltered] = useState<Anomaly[]>([]);
  const [selectedService, setSelectedService] = useState("");
  const [loading, setLoading] = useState(true);
  const [zThreshold, setZThreshold] = useState<number>(2.0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      const result = await fetchAnomalies(zThreshold);
      setAnomalies(result);
      setLoading(false);
      if (result.length === 0) {
        setError("No anomalies returned. Try lowering the Z-threshold.");
      }
    }
    loadData();
  }, [zThreshold]);

  useEffect(() => {
    if (!selectedService) {
      setFiltered(anomalies);
    } else {
      setFiltered(anomalies.filter((a) => a.service === selectedService));
    }
  }, [selectedService, anomalies]);

  return (
    <div className="container stack-lg">
      <Breadcrumb items={[{ label: "Detected Anomalies" }]} />
      <div className="page-header">
        <h2 className="page-title">Detected Anomalies</h2>
        <p className="page-subtitle">
          Unusual spend spikes and outliers across services.
        </p>
      </div>
      <div className="toolbar">
        <label htmlFor="service">Service:</label>
        <ServiceFilterDropdown
          selected={selectedService}
          onChange={setSelectedService}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginLeft: "auto",
          }}
        >
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
            <AnomalyScatterPlot anomalies={filtered} />
          </div>
          <AnomalyTable anomalies={filtered} />
        </>
      )}
    </div>
  );
};

export default Anomalies;
