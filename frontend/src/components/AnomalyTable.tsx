import { useState } from "react";
import type { Anomaly } from "../api/anomalyApi";
import {
  convertToCSV,
  downloadCSV,
  formatAnomaliesForExport,
  generateFilename,
} from "../utils/csvExport";

interface AnomalyTableProps {
  anomalies: Anomaly[];
}

type SortField = "date" | "service" | "amount" | "z_score";
type SortDirection = "asc" | "desc";

const AnomalyTable = ({ anomalies }: AnomalyTableProps) => {
  const [sortField, setSortField] = useState<SortField>("z_score");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedAnomalies = [...anomalies].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortField) {
      case "date":
        aValue = new Date(a.date).getTime();
        bValue = new Date(b.date).getTime();
        break;
      case "service":
        aValue = a.service.toLowerCase();
        bValue = b.service.toLowerCase();
        break;
      case "amount":
        aValue = a.amount;
        bValue = b.amount;
        break;
      case "z_score":
        aValue = a.z_score;
        bValue = b.z_score;
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const getSeverityBadge = (zScore: number) => {
    if (zScore >= 3) {
      return <span className="badge badge-danger">High</span>;
    } else if (zScore >= 2.5) {
      return <span className="badge badge-warning">Medium-High</span>;
    } else if (zScore >= 2) {
      return <span className="badge badge-info">Medium</span>;
    } else {
      return <span className="badge badge-success">Low</span>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <span className="sort-icon">↕</span>;
    }
    return (
      <span className="sort-icon">{sortDirection === "asc" ? "↑" : "↓"}</span>
    );
  };

  const handleExportCSV = () => {
    const exportData = formatAnomaliesForExport(sortedAnomalies);
    const csvContent = convertToCSV(exportData);
    const filename = generateFilename("anomalies");
    downloadCSV(csvContent, filename);
  };

  return (
    <div className="anomaly-table-container">
      <div className="table-header">
        <h3>Anomaly Details</h3>
        <div className="table-header-actions">
          <span className="table-count">
            {anomalies.length} anomalies found
          </span>
          <button
            onClick={handleExportCSV}
            className="export-btn"
            disabled={anomalies.length === 0}
            title="Export anomalies to CSV"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="anomaly-table">
          <thead>
            <tr>
              <th className="sortable" onClick={() => handleSort("date")}>
                Date <SortIcon field="date" />
              </th>
              <th className="sortable" onClick={() => handleSort("service")}>
                Service <SortIcon field="service" />
              </th>
              <th className="sortable" onClick={() => handleSort("amount")}>
                Cost <SortIcon field="amount" />
              </th>
              <th className="sortable" onClick={() => handleSort("z_score")}>
                Z-Score <SortIcon field="z_score" />
              </th>
              <th>Severity</th>
            </tr>
          </thead>
          <tbody>
            {sortedAnomalies.map((anomaly, idx) => (
              <tr key={`${anomaly.service}-${anomaly.date}-${idx}`}>
                <td className="date-cell">{formatDate(anomaly.date)}</td>
                <td className="service-cell">
                  <span className="service-name">{anomaly.service}</span>
                </td>
                <td className="amount-cell">
                  <span className="amount-value">
                    ${anomaly.amount.toFixed(2)}
                  </span>
                </td>
                <td className="zscore-cell">
                  <span className="zscore-value">
                    {anomaly.z_score.toFixed(2)}
                  </span>
                </td>
                <td className="severity-cell">
                  {getSeverityBadge(anomaly.z_score)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnomalyTable;
