import React from "react";
import { useDataSource } from "../contexts/DataSourceContext";
import type { DataSource } from "../contexts/DataSourceContext";
import { Database, Cloud, RefreshCw } from "lucide-react";
import { Box, Flex } from "./ui";

const DataSourceToggle: React.FC = () => {
  const { dataSource, setDataSource, loading, error } = useDataSource();

  const handleToggle = (source: DataSource) => {
    setDataSource(source);

    // Simple console log for now
    const sourceLabel = source === "mock" ? "Mock Data" : "Real AWS Data";

    console.log(`Data Source Changed: ${sourceLabel}`);
  };

  if (loading) {
    return (
      <Box className="btn btn-ghost d-flex items-center gap-sm px-md py-sm">
        <RefreshCw size={16} className="animate-spin" />
        <span className="text-small">Loading...</span>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="btn btn-ghost d-flex items-center gap-sm px-md py-sm">
        <span>⚠️</span>
        <span className="text-small">Error</span>
      </Box>
    );
  }

  return (
    <Flex align="center" gap="xs" className="data-source-toggle">
      <button
        onClick={() => handleToggle("mock")}
        className={`btn btn-sm ${
          dataSource === "mock" ? "btn-primary" : "btn-ghost"
        } d-flex items-center gap-xs px-sm py-xs`}
        title="Use mock data for testing"
        aria-label={`Mock data ${dataSource === "mock" ? "(selected)" : ""}`}
        disabled={loading}
      >
        <Database size={14} />
        <span className="text-small">Mock</span>
      </button>

      <button
        onClick={() => handleToggle("real")}
        className={`btn btn-sm ${
          dataSource === "real" ? "btn-primary" : "btn-ghost"
        } d-flex items-center gap-xs px-sm py-xs`}
        title="Use real AWS data"
        aria-label={`Real AWS data ${
          dataSource === "real" ? "(selected)" : ""
        }`}
        disabled={loading}
      >
        <Cloud size={14} />
        <span className="text-small">Real</span>
      </button>
    </Flex>
  );
};

export default DataSourceToggle;
