import { useState } from "react";
import {
  convertToCSV,
  downloadCSV,
  formatRecommendationsForExport,
  generateFilename,
} from "../utils/csvExport";

interface Recommendation {
  service: string;
  reason: string;
  suggestion: string;
}

interface Props {
  recommendations: Recommendation[];
}

type SortField = "service" | "reason" | "suggestion";
type SortDirection = "asc" | "desc";

const RecommendationTable = ({ recommendations }: Props) => {
  const [sortField, setSortField] = useState<SortField>("service");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedRecommendations = [...recommendations].sort((a, b) => {
    let aValue: string;
    let bValue: string;

    switch (sortField) {
      case "service":
        aValue = a.service.toLowerCase();
        bValue = b.service.toLowerCase();
        break;
      case "reason":
        aValue = a.reason.toLowerCase();
        bValue = b.reason.toLowerCase();
        break;
      case "suggestion":
        aValue = a.suggestion.toLowerCase();
        bValue = b.suggestion.toLowerCase();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const getPriorityBadge = (suggestion: string) => {
    const lowerSuggestion = suggestion.toLowerCase();
    if (
      lowerSuggestion.includes("investigate") ||
      lowerSuggestion.includes("spikes")
    ) {
      return <span className="badge badge-danger">High Priority</span>;
    } else if (
      lowerSuggestion.includes("reduce") ||
      lowerSuggestion.includes("optimize")
    ) {
      return <span className="badge badge-warning">Medium Priority</span>;
    } else if (
      lowerSuggestion.includes("consider") ||
      lowerSuggestion.includes("monitor")
    ) {
      return <span className="badge badge-info">Low Priority</span>;
    }
    return <span className="badge badge-success">Info</span>;
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
    const exportData = formatRecommendationsForExport(sortedRecommendations);
    const csvContent = convertToCSV(exportData);
    const filename = generateFilename("recommendations");
    downloadCSV(csvContent, filename);
  };

  return (
    <div className="recommendation-table-container">
      <div className="table-header">
        <h3>AI-Generated Recommendations</h3>
        <div className="table-header-actions">
          <span className="table-count">
            {recommendations.length} recommendations found
          </span>
          <button
            onClick={handleExportCSV}
            className="export-btn"
            disabled={recommendations.length === 0}
            title="Export recommendations to CSV"
          >
            📥 Export CSV
          </button>
        </div>
      </div>

      {recommendations.length === 0 ? (
        <div className="empty-state">
          <p>No recommendations available.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="recommendation-table">
            <thead>
              <tr>
                <th className="sortable" onClick={() => handleSort("service")}>
                  Service <SortIcon field="service" />
                </th>
                <th className="sortable" onClick={() => handleSort("reason")}>
                  Reason <SortIcon field="reason" />
                </th>
                <th
                  className="sortable"
                  onClick={() => handleSort("suggestion")}
                >
                  Suggestion <SortIcon field="suggestion" />
                </th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              {sortedRecommendations.map((rec, idx) => (
                <tr key={`${rec.service}-${idx}`}>
                  <td className="service-cell">
                    <span className="service-name">{rec.service}</span>
                  </td>
                  <td className="reason-cell">
                    <div className="reason-content">
                      {rec.reason || "No specific reason provided"}
                    </div>
                  </td>
                  <td className="suggestion-cell">
                    <div className="suggestion-content">
                      <div className="suggestion-text">{rec.suggestion}</div>
                    </div>
                  </td>
                  <td className="priority-cell">
                    {getPriorityBadge(rec.suggestion)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecommendationTable;
