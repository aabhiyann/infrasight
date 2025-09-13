import React from "react";
import { useDataSource } from "../contexts/DataSourceContext";
import type { DataSource } from "../contexts/DataSourceContext";
import { Database, Cloud, RefreshCw } from "lucide-react";

const DataSourceToggle: React.FC = () => {
  const { dataSource, setDataSource, loading, error } = useDataSource();

  const handleToggle = (source: DataSource) => {
    setDataSource(source);

    // Simple console log for now
    const sourceLabel = source === "mock" ? "Mock Data" : "Real AWS Data";

    console.log(`Data Source Changed: ${sourceLabel}`);
  };

  const getCurrentIcon = () => {
    if (loading) return <RefreshCw size={16} className="animate-spin" />;
    if (error) return "⚠️";
    if (dataSource === "real") return <Cloud size={16} />;
    if (dataSource === "mock") return <Database size={16} />;
    return <RefreshCw size={16} />; // Auto
  };

  const getCurrentLabel = () => {
    if (loading) return "Loading...";
    if (error) return "Error";
    if (dataSource === "real") return "Real AWS";
    if (dataSource === "mock") return "Mock Data";
    return "Auto (Mock)"; // Auto defaults to Mock
  };

  const cycleDataSource = () => {
    const sources: DataSource[] = ["mock", "real", "auto"];
    const currentIndex = sources.indexOf(dataSource);
    const nextSource = sources[(currentIndex + 1) % sources.length];
    handleToggle(nextSource);
  };

  return (
    <button
      onClick={cycleDataSource}
      className="btn btn-ghost d-flex items-center gap-sm px-md py-sm"
      title={`Switch data source. Current: ${getCurrentLabel()}`}
      aria-label={`Current data source: ${getCurrentLabel()}. Click to switch data source.`}
      disabled={loading}
    >
      {getCurrentIcon()}
      <span className="text-small">{getCurrentLabel()}</span>
    </button>
  );
};

export default DataSourceToggle;
