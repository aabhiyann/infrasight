import { useEffect, useState } from "react";
import LogTable from "../components/LogTable";
import AddLogForm from "../components/AddLogForm";
import Modal from "../components/Modal";
import { fetchLogs, type LogEntry } from "../api/logApi.ts";
import { fetchAvailableServices } from "../api/forecastApi";
import Skeleton from "../components/Skeleton";
import EmptyState from "../components/EmptyState";

const Logs = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [availableServices, setAvailableServices] = useState<string[]>([]);

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
    fetchAvailableServices().then(setAvailableServices);
  }, []);

  const handleAddLogSuccess = (newLog: LogEntry) => {
    setLogs((prevLogs) => [newLog, ...prevLogs]);
  };

  const handleLogUpdate = (updatedLog: LogEntry) => {
    setLogs((prevLogs) =>
      prevLogs.map((log) => (log.id === updatedLog.id ? updatedLog : log))
    );
  };

  const handleLogDelete = (logId: number) => {
    setLogs((prevLogs) => prevLogs.filter((log) => log.id !== logId));
  };

  return (
    <div className="container stack-lg">
      <div className="page-header">
        <div>
          <h2 className="page-title">Cost Logs</h2>
          <p className="page-subtitle">
            Database-backed ingestion and processing logs.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn btn-primary d-flex items-center gap-sm"
          aria-label="Add New Log"
          title="Add New Log"
        >
          ➕ <span className="hide-sm-text">Add New Log</span>
        </button>
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
          <LogTable
            logs={logs}
            onLogUpdate={handleLogUpdate}
            onLogDelete={handleLogDelete}
            availableServices={availableServices}
          />
        </div>
      )}

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Log Entry"
      >
        <AddLogForm
          onSuccess={handleAddLogSuccess}
          onClose={() => setIsAddModalOpen(false)}
          availableServices={availableServices}
        />
      </Modal>
    </div>
  );
};

export default Logs;
