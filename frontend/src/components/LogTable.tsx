import { useState, useMemo } from "react";

interface LogEntry {
  id: number;
  date: string;
  service: string;
  amount: number;
  source?: string;
}

interface Props {
  logs: LogEntry[];
}

type SortField = "date" | "service" | "amount" | "source";
type SortDirection = "asc" | "desc";

const LogTable = ({ logs }: Props) => {
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Filter and search logs
  const filteredLogs = useMemo(() => {
    if (!searchTerm) return logs;

    const searchLower = searchTerm.toLowerCase();
    return logs.filter(
      (log) =>
        log.service.toLowerCase().includes(searchLower) ||
        log.amount.toString().includes(searchLower) ||
        (log.source ?? "db").toLowerCase().includes(searchLower) ||
        new Date(log.date)
          .toLocaleDateString()
          .toLowerCase()
          .includes(searchLower)
    );
  }, [logs, searchTerm]);

  // Sort filtered logs
  const sortedLogs = useMemo(() => {
    return [...filteredLogs].sort((a, b) => {
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
        case "source":
          aValue = (a.source ?? "db").toLowerCase();
          bValue = (b.source ?? "db").toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredLogs, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLogs = sortedLogs.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSourceBadge = (source?: string) => {
    const sourceValue = source ?? "db";
    const badgeClass =
      sourceValue === "api" ? "badge badge-info" : "badge badge-success";
    return <span className={badgeClass}>{sourceValue.toUpperCase()}</span>;
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <span className="sort-icon">↕</span>;
    }
    return (
      <span className="sort-icon">{sortDirection === "asc" ? "↑" : "↓"}</span>
    );
  };

  return (
    <div className="log-table-container">
      <div className="table-header">
        <h3>Database Logs</h3>
        <span className="table-count">
          {sortedLogs.length} of {logs.length} log entries
        </span>
      </div>

      {/* Search and Controls */}
      <div className="table-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
            className="search-input"
          />
        </div>
        <div className="pagination-controls">
          <label htmlFor="items-per-page">Show:</label>
          <select
            id="items-per-page"
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className="items-per-page-select"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {logs.length === 0 ? (
        <div className="empty-state">
          <p>No logs found.</p>
        </div>
      ) : sortedLogs.length === 0 ? (
        <div className="empty-state">
          <p>No logs match your search criteria.</p>
        </div>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="log-table">
              <thead>
                <tr>
                  <th className="sortable" onClick={() => handleSort("date")}>
                    Date <SortIcon field="date" />
                  </th>
                  <th
                    className="sortable"
                    onClick={() => handleSort("service")}
                  >
                    Service <SortIcon field="service" />
                  </th>
                  <th className="sortable" onClick={() => handleSort("amount")}>
                    Amount <SortIcon field="amount" />
                  </th>
                  <th className="sortable" onClick={() => handleSort("source")}>
                    Source <SortIcon field="source" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="date-cell">
                      <span className="date-value">{formatDate(log.date)}</span>
                    </td>
                    <td className="service-cell">
                      <span className="service-name">{log.service}</span>
                    </td>
                    <td className="amount-cell">
                      <span className="amount-value">
                        ${log.amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="source-cell">
                      {getSourceBadge(log.source)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <div className="pagination-info">
                Showing {startIndex + 1}-{Math.min(endIndex, sortedLogs.length)}{" "}
                of {sortedLogs.length} entries
              </div>
              <div className="pagination-buttons">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  Previous
                </button>

                <div className="page-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => {
                      // Show first page, last page, current page, and pages around current
                      const shouldShow =
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1);

                      if (!shouldShow) {
                        // Show ellipsis for gaps
                        if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return (
                            <span key={page} className="pagination-ellipsis">
                              ...
                            </span>
                          );
                        }
                        return null;
                      }

                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`pagination-btn ${
                            currentPage === page ? "active" : ""
                          }`}
                        >
                          {page}
                        </button>
                      );
                    }
                  )}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LogTable;
