import { useState, useMemo } from "react";
import {
  convertToCSV,
  downloadCSV,
  formatLogsForExport,
  generateFilename,
} from "../utils/csvExport";
import { deleteLog } from "../api/logApi";
import ConfirmModal from "./ConfirmModal";
import Modal from "./Modal";
import AddLogForm from "./AddLogForm";

interface LogEntry {
  id: number;
  date: string;
  service: string;
  amount: number;
  source?: string;
}

interface LogTableProps {
  logs: LogEntry[];
  onLogUpdate: (updatedLog: LogEntry) => void;
  onLogDelete: (logId: number) => void;
  availableServices: string[];
}

type SortField = "date" | "service" | "amount" | "source";
type SortDirection = "asc" | "desc";

const LogTable = ({
  logs,
  onLogUpdate,
  onLogDelete,
  availableServices,
}: LogTableProps) => {
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

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

  const handleExportCSV = () => {
    const exportData = formatLogsForExport(sortedLogs);
    const csvContent = convertToCSV(exportData);
    const filename = generateFilename("logs");
    downloadCSV(csvContent, filename);
  };

  const handleEditLog = (log: LogEntry) => {
    setSelectedLog(log);
    setEditModalOpen(true);
  };

  const handleDeleteLog = (log: LogEntry) => {
    setSelectedLog(log);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedLog) return;

    try {
      await deleteLog(selectedLog.id);
      onLogDelete(selectedLog.id);
      setSelectedLog(null);
    } catch (error) {
      console.error("Failed to delete log:", error);
      alert("Failed to delete log. Please try again.");
    }
  };

  const handleLogUpdate = (updatedLog: LogEntry) => {
    onLogUpdate(updatedLog);
    setEditModalOpen(false);
    setSelectedLog(null);
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
          <button
            onClick={handleExportCSV}
            className="export-btn"
            disabled={sortedLogs.length === 0}
            title="Export filtered data to CSV"
          >
            📥 Export CSV
          </button>
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
                  <th>Actions</th>
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
                    <td className="actions-cell">
                      <div className="action-buttons">
                        <button
                          onClick={() => handleEditLog(log)}
                          className="action-btn edit-btn"
                          title="Edit log entry"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteLog(log)}
                          className="action-btn delete-btn"
                          title="Delete log entry"
                        >
                          🗑️
                        </button>
                      </div>
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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedLog(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Log Entry"
        message={`Are you sure you want to delete this log entry for ${selectedLog?.service}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Edit Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedLog(null);
        }}
        title="Edit Log Entry"
      >
        <AddLogForm
          onSuccess={handleLogUpdate}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedLog(null);
          }}
          availableServices={availableServices}
          initialData={selectedLog}
        />
      </Modal>
    </div>
  );
};

export default LogTable;
