import { useEffect, useState } from "react";
import LogTable from "../components/LogTable";
import { fetchLogs, type LogEntry } from "../api/logApi.ts";

const Logs = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLogs() {
      try {
        const data = await fetchLogs();
        setLogs(data);
      } catch {
        setError("Failed to load logs.");
      } finally {
        setLoading(false);
      }
    }

    loadLogs();
  }, []);

  return (
    <div className="container stack-lg">
      <div className="page-header">
        <h2 className="page-title">Cost Logs</h2>
        <p className="page-subtitle">
          Database-backed ingestion and processing logs.
        </p>
      </div>
      {loading ? (
        <p>Loading logs...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div className="card">
          <LogTable logs={logs} />
        </div>
      )}
    </div>
  );
};

export default Logs;
