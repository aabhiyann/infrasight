import React, { useState, useRef, useEffect } from "react";
import { useDataSource } from "../contexts/DataSourceContext";
import type { DataSource } from "../contexts/DataSourceContext";
import { Database, Cloud, RefreshCw, ChevronDown } from "lucide-react";

const DataSourceToggle: React.FC = () => {
  const { dataSource, setDataSource, loading, error } = useDataSource();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (source: DataSource) => {
    setDataSource(source);
    setIsOpen(false);

    // Simple console log for now
    const sourceLabel = source === "mock" ? "Mock Data" : "Real AWS Data";
    console.log(`Data Source Changed: ${sourceLabel}`);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getCurrentIcon = () => {
    if (loading) return <RefreshCw size={16} className="animate-spin" />;
    if (error) return "⚠️";
    if (dataSource === "real") return <Cloud size={16} />;
    return <Database size={16} />;
  };

  const getCurrentLabel = () => {
    if (loading) return "Loading...";
    if (error) return "Error";
    if (dataSource === "real") return "Real AWS";
    return "Mock Data";
  };

  return (
    <div
      className="dropdown"
      ref={dropdownRef}
      style={{ position: "relative" }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-ghost d-flex items-center gap-sm px-md py-sm"
        title={`Current: ${getCurrentLabel()}. Click to change data source.`}
        aria-label={`Data source: ${getCurrentLabel()}. Click to change.`}
        disabled={loading || !!error}
      >
        {getCurrentIcon()}
        <span className="text-small">{getCurrentLabel()}</span>
        <ChevronDown
          size={14}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          className="dropdown-menu"
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: "4px",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "6px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            zIndex: 1000,
            minWidth: "140px",
          }}
        >
          <button
            onClick={() => handleSelect("mock")}
            className={`dropdown-item d-flex items-center gap-sm px-md py-sm ${
              dataSource === "mock" ? "active" : ""
            }`}
            style={{
              width: "100%",
              textAlign: "left",
              background:
                dataSource === "mock"
                  ? "var(--color-primary-light)"
                  : "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
            onMouseEnter={(e) => {
              if (dataSource !== "mock") {
                e.currentTarget.style.background = "var(--color-surface-hover)";
              }
            }}
            onMouseLeave={(e) => {
              if (dataSource !== "mock") {
                e.currentTarget.style.background = "transparent";
              }
            }}
          >
            <Database size={16} />
            <span>Mock Data</span>
            {dataSource === "mock" && <span className="text-primary">✓</span>}
          </button>

          <button
            onClick={() => handleSelect("real")}
            className={`dropdown-item d-flex items-center gap-sm px-md py-sm ${
              dataSource === "real" ? "active" : ""
            }`}
            style={{
              width: "100%",
              textAlign: "left",
              background:
                dataSource === "real"
                  ? "var(--color-primary-light)"
                  : "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
            onMouseEnter={(e) => {
              if (dataSource !== "real") {
                e.currentTarget.style.background = "var(--color-surface-hover)";
              }
            }}
            onMouseLeave={(e) => {
              if (dataSource !== "real") {
                e.currentTarget.style.background = "transparent";
              }
            }}
          >
            <Cloud size={16} />
            <span>Real AWS</span>
            {dataSource === "real" && <span className="text-primary">✓</span>}
          </button>
        </div>
      )}
    </div>
  );
};

export default DataSourceToggle;
