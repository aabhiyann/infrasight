import { useState, useMemo } from "react";
import { ChevronDown, Download } from "lucide-react";

export interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  searchable?: boolean;
  exportable?: boolean;
  onExport?: () => void;
  emptyMessage?: string;
  className?: string;
}

type SortDirection = "asc" | "desc";

function DataTable<T extends Record<string, any>>({
  data,
  columns,
  title,
  searchable = false,
  exportable = false,
  onExport,
  emptyMessage = "No data available",
  className = "",
}: DataTableProps<T>) {
  const [sortField, setSortField] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleSort = (field: keyof T) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = data;

    // Apply search filter
    if (searchTerm) {
      filtered = data.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply sorting
    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, searchTerm, sortField, sortDirection]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  const SortIcon = ({ field }: { field: keyof T }) => {
    if (sortField !== field) {
      return <span className="sort-icon">↕</span>;
    }
    return (
      <span className="sort-icon">{sortDirection === "asc" ? "↑" : "↓"}</span>
    );
  };

  if (data.length === 0) {
    return (
      <div className={`data-table-container ${className}`}>
        {title && (
          <div className="table-header">
            <h3>{title}</h3>
          </div>
        )}
        <div className="empty-state">
          <p>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`data-table-container ${className}`}>
      {title && (
        <div className="table-header">
          <h3>{title}</h3>
          <div className="table-header-actions">
            <span className="table-count">
              {filteredAndSortedData.length} items found
            </span>
            {exportable && onExport && (
              <button onClick={onExport} className="export-btn">
                <Download size={16} />
                Export CSV
              </button>
            )}
          </div>
        </div>
      )}

      {searchable && (
        <div className="table-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      )}

      <div className="table-wrapper">
        <table className="table table--sticky">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`${column.sortable ? "sortable" : ""} ${
                    column.className || ""
                  }`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  {column.label}
                  {column.sortable && <SortIcon field={column.key} />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={column.className || ""}
                  >
                    {column.render
                      ? column.render(item[column.key], item)
                      : String(item[column.key] || "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination-controls">
          <div className="pagination-info">
            Showing{" "}
            {Math.min(
              (currentPage - 1) * itemsPerPage + 1,
              filteredAndSortedData.length
            )}{" "}
            to{" "}
            {Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)}{" "}
            of {filteredAndSortedData.length} entries
          </div>
          <div className="pagination-buttons">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="btn btn-sm"
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="btn btn-sm"
            >
              Previous
            </button>
            <span className="pagination-page">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="btn btn-sm"
            >
              Next
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="btn btn-sm"
            >
              Last
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
