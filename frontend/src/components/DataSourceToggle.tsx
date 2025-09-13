import React from "react";
import { useDataSource } from "../contexts/DataSourceContext";
import type { DataSource } from "../contexts/DataSourceContext";

const DataSourceToggle: React.FC = () => {
  const { dataSource, setDataSource, isRealData, loading, error } =
    useDataSource();

  const handleToggle = (source: DataSource) => {
    setDataSource(source);

    // Simple console log for now
    const sourceLabel =
      source === "mock"
        ? "Mock Data"
        : source === "real"
        ? "Real AWS Data"
        : "Auto (Backend Default)";

    console.log(`Data Source Changed: ${sourceLabel}`);
  };

  const getStatusColor = () => {
    if (loading) return "var(--color-text-muted)";
    if (error) return "var(--color-error)";
    if (isRealData) return "var(--color-success)";
    return "var(--color-warning)";
  };

  const getStatusIcon = () => {
    if (loading) return "⏳";
    if (error) return "❌";
    if (isRealData) return "☁️";
    return "🎭";
  };

  const getStatusText = () => {
    if (loading) return "Loading...";
    if (error) return "Error";
    if (isRealData) return "Real AWS Data";
    return "Mock Data";
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "4px",
        borderRadius: "6px",
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
      }}
    >
      {/* Status Indicator */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          fontSize: "0.75rem",
          color: getStatusColor(),
        }}
      >
        <span>{getStatusIcon()}</span>
        <span style={{ fontWeight: 500 }}>{getStatusText()}</span>
      </div>

      {/* Toggle Buttons */}
      <div style={{ display: "flex", gap: "4px" }}>
        <button
          onClick={() => handleToggle("mock")}
          style={{
            padding: "4px 8px",
            fontSize: "0.75rem",
            borderRadius: "4px",
            border: "1px solid var(--color-border)",
            background:
              dataSource === "mock" ? "var(--color-primary)" : "transparent",
            color: dataSource === "mock" ? "white" : "var(--color-text)",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          disabled={loading}
        >
          🎭
        </button>

        <button
          onClick={() => handleToggle("real")}
          style={{
            padding: "4px 8px",
            fontSize: "0.75rem",
            borderRadius: "4px",
            border: "1px solid var(--color-border)",
            background:
              dataSource === "real" ? "var(--color-primary)" : "transparent",
            color: dataSource === "real" ? "white" : "var(--color-text)",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          disabled={loading}
        >
          ☁️
        </button>

        <button
          onClick={() => handleToggle("auto")}
          style={{
            padding: "4px 8px",
            fontSize: "0.75rem",
            borderRadius: "4px",
            border: "1px solid var(--color-border)",
            background:
              dataSource === "auto" ? "var(--color-primary)" : "transparent",
            color: dataSource === "auto" ? "white" : "var(--color-text)",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          disabled={loading}
        >
          🔄
        </button>
      </div>
    </div>
  );
};

export default DataSourceToggle;
