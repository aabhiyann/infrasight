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
    <div className="header-user" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="header-user-trigger d-flex items-center gap-sm"
        title={`Current: ${getCurrentLabel()}. Click to change data source.`}
        aria-label={`Data source: ${getCurrentLabel()}. Click to change.`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
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
        <div className="header-user-menu" role="menu">
          <button
            onClick={() => handleSelect("mock")}
            className="header-menu-item d-flex items-center gap-sm"
            role="menuitem"
          >
            <Database size={16} />
            <span>Mock Data</span>
            {dataSource === "mock" && <span className="text-primary">✓</span>}
          </button>

          <button
            onClick={() => handleSelect("real")}
            className="header-menu-item d-flex items-center gap-sm"
            role="menuitem"
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
