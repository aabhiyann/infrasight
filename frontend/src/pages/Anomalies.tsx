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
    <div className="container">
      <h2>Detected Anomalies</h2>
      <ServiceSelector
        services={services}
        selectedService={selectedService}
        onChange={setSelectedService}
      />
      {loading ? <p>Loading anomalies...</p> : <AnomalyChart data={filtered} />}
    </div>
  );
};

export default Anomalies;
