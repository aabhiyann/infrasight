import React from "react";
import { Box, Flex } from "./ui";
import { useDataSource } from "../contexts/DataSourceContext";
import type { DataSource } from "../contexts/DataSourceContext";

const DataSourceToggle: React.FC = () => {
  const {
    dataSource,
    setDataSource,
    isRealData,
    dataSourceInfo,
    loading,
    error,
  } = useDataSource();

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
    <Box className="data-source-toggle">
      <Flex align="center" gap="sm" style={{ flexWrap: "wrap" }}>
        {/* Status Indicator */}
        <Flex align="center" gap="xs" style={{ fontSize: "0.875rem" }}>
          <span style={{ color: getStatusColor() }}>{getStatusIcon()}</span>
          <span style={{ color: getStatusColor(), fontWeight: 500 }}>
            {getStatusText()}
          </span>
        </Flex>

        {/* Toggle Buttons */}
        <Flex align="center" gap="xs">
          <button
            onClick={() => handleToggle("mock")}
            className={`data-source-btn ${
              dataSource === "mock" ? "active" : ""
            }`}
            style={{
              padding: "4px 8px",
              fontSize: "0.75rem",
              borderRadius: "4px",
              border: "1px solid var(--color-border)",
              background:
                dataSource === "mock"
                  ? "var(--color-primary)"
                  : "var(--color-surface)",
              color:
                dataSource === "mock"
                  ? "var(--color-primary-foreground)"
                  : "var(--color-text)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            disabled={loading}
          >
            🎭 Mock
          </button>

          <button
            onClick={() => handleToggle("real")}
            className={`data-source-btn ${
              dataSource === "real" ? "active" : ""
            }`}
            style={{
              padding: "4px 8px",
              fontSize: "0.75rem",
              borderRadius: "4px",
              border: "1px solid var(--color-border)",
              background:
                dataSource === "real"
                  ? "var(--color-primary)"
                  : "var(--color-surface)",
              color:
                dataSource === "real"
                  ? "var(--color-primary-foreground)"
                  : "var(--color-text)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            disabled={loading}
          >
            ☁️ Real
          </button>

          <button
            onClick={() => handleToggle("auto")}
            className={`data-source-btn ${
              dataSource === "auto" ? "active" : ""
            }`}
            style={{
              padding: "4px 8px",
              fontSize: "0.75rem",
              borderRadius: "4px",
              border: "1px solid var(--color-border)",
              background:
                dataSource === "auto"
                  ? "var(--color-primary)"
                  : "var(--color-surface)",
              color:
                dataSource === "auto"
                  ? "var(--color-primary-foreground)"
                  : "var(--color-text)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            disabled={loading}
          >
            🔄 Auto
          </button>
        </Flex>

        {/* Connection Status */}
        {dataSourceInfo?.aws_connection && (
          <Flex
            align="center"
            gap="xs"
            style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}
          >
            <span>
              {dataSourceInfo.aws_connection.status === "success" ? "✅" : "❌"}
            </span>
            <span>
              AWS:{" "}
              {dataSourceInfo.aws_connection.status === "success"
                ? "Connected"
                : "Disconnected"}
            </span>
          </Flex>
        )}
      </Flex>

      {/* Error Message */}
      {error && (
        <Box
          style={{
            marginTop: "4px",
            fontSize: "0.75rem",
            color: "var(--color-error)",
            background: "var(--color-error-subtle)",
            padding: "4px 8px",
            borderRadius: "4px",
          }}
        >
          ⚠️ {error}
        </Box>
      )}

      {/* Additional Info */}
      {dataSourceInfo && !error && (
        <Box
          style={{
            marginTop: "4px",
            fontSize: "0.75rem",
            color: "var(--color-text-muted)",
          }}
        >
          Backend default:{" "}
          {dataSourceInfo.use_real_data_env === "true"
            ? "Real Data"
            : "Mock Data"}
          {dataSourceInfo.aws_connection?.available_services && (
            <span>
              {" "}
              • {dataSourceInfo.aws_connection.available_services} AWS services
              available
            </span>
          )}
        </Box>
      )}
    </Box>
  );
};

export default DataSourceToggle;
