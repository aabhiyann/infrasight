import { useEffect, useState } from "react";
import LogTable from "../components/LogTable";
import { fetchLogs, type LogEntry } from "../api/logApi.ts";
import Breadcrumb from "../components/Breadcrumb";
import Skeleton from "../components/Skeleton";
import EmptyState from "../components/EmptyState";

const Logs = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLogs = async () => {
    try {
      const data = await fetchLogs();
      setLogs(data);
    } catch {
      setError("Failed to load logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div className="container stack-lg">
      <Breadcrumb items={[{ label: "Cost Logs" }]} />
      <div className="page-header">
        <h2 className="page-title">Cost Logs</h2>
        <p className="page-subtitle">
          Database-backed ingestion and processing logs.
        </p>
      </div>
      {loading ? (
        <div className="card">
          <Skeleton height={300} />
        </div>
      ) : error ? (
        <div className="card">
          <EmptyState
            title="Error loading logs"
            message={error}
            icon="alert"
            onRetry={() => {
              setError(null);
              setLoading(true);
              loadLogs();
            }}
          />
        </div>
      ) : logs.length === 0 ? (
        <div className="card">
          <EmptyState
            title="No logs available"
            message="No log entries found in the database."
            icon="alert"
          />
        </div>
      ) : (
        <div className="card">
          <LogTable logs={logs} />
        </div>
      )}
    </div>
  );
};

export default Logs;
