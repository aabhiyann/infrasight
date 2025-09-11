import { useEffect, useState } from "react";
import { fetchAnomalies, type Anomaly } from "../api/anomalyApi";
import AnomalyChart from "../components/AnomalyChart";

function Anomalies() {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const result = await fetchAnomalies();
      setAnomalies(result);
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Detected Anomalies</h2>
      {loading ? (
        <p>Loading anomalies...</p>
      ) : (
        <AnomalyChart data={anomalies} />
      )}
    </div>
  );
}

export default Anomalies;
