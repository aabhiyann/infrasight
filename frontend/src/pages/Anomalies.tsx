import { useEffect, useState } from "react";
import { fetchAnomalies, type Anomaly } from "../api/anomalyApi";
import AnomalyScatterPlot from "../components/AnomalyScatterPlot";
import ServiceFilterDropdown from "../components/ServiceFilterDropdown";

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
          <label htmlFor="z-threshold" style={{ fontSize: 14 }}>
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
            style={{ width: 80 }}
          />
        </div>
      </div>
      {loading ? (
        <p>Loading anomalies...</p>
      ) : error ? (
        <p style={{ color: "#b00020" }}>{error}</p>
      ) : filtered.length === 0 ? (
        <p>No anomalies found.</p>
      ) : (
        <div className="card">
          <AnomalyScatterPlot anomalies={filtered} />
        </div>
      )}
    </div>
  );
};

export default Anomalies;
