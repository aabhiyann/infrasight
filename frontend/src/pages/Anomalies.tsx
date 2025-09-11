import { useEffect, useState } from "react";
import { fetchAnomalies, type Anomaly } from "../api/anomalyApi";
import AnomalyChart from "../components/AnomalyChart";
import ServiceSelector from "../components/ServiceSelector";

const Anomalies = () => {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [filtered, setFiltered] = useState<Anomaly[]>([]);
  const [services, setServices] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const result = await fetchAnomalies();
      setAnomalies(result);
      setServices([...new Set(result.map((a) => a.service))]);
      setLoading(false);
    }
    loadData();
  }, []);

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
        <ServiceSelector
          services={services}
          selectedService={selectedService}
          onChange={setSelectedService}
        />
      </div>
      {loading ? (
        <p>Loading anomalies...</p>
      ) : (
        <div className="card">
          <AnomalyChart data={filtered} />
        </div>
      )}
    </div>
  );
};

export default Anomalies;
