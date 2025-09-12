// CSV Export utility functions

export interface ExportableData {
  [key: string]: string | number | boolean | null | undefined;
}

/**
 * Converts an array of objects to CSV format
 */
export function convertToCSV(
  data: ExportableData[],
  headers?: string[]
): string {
  if (data.length === 0) return "";

  // Get headers from data if not provided
  const csvHeaders = headers || Object.keys(data[0]);

  // Create CSV header row
  const headerRow = csvHeaders.map((header) => `"${header}"`).join(",");

  // Create CSV data rows
  const dataRows = data.map((row) =>
    csvHeaders
      .map((header) => {
        const value = row[header];
        // Handle null/undefined values
        if (value === null || value === undefined) return '""';
        // Escape quotes and wrap in quotes
        const stringValue = String(value).replace(/"/g, '""');
        return `"${stringValue}"`;
      })
      .join(",")
  );

  return [headerRow, ...dataRows].join("\n");
}

/**
 * Downloads CSV data as a file
 */
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Formats data for specific table types
 */
export function formatLogsForExport(logs: any[]): ExportableData[] {
  return logs.map((log) => ({
    Date: new Date(log.date).toLocaleString(),
    Service: log.service,
    Amount: log.amount,
    Source: log.source || "db",
  }));
}

export function formatAnomaliesForExport(anomalies: any[]): ExportableData[] {
  return anomalies.map((anomaly) => ({
    Date: new Date(anomaly.date).toLocaleString(),
    Service: anomaly.service,
    Amount: anomaly.amount,
    "Z-Score": anomaly.z_score,
    Severity:
      anomaly.z_score >= 3
        ? "High"
        : anomaly.z_score >= 2.5
        ? "Medium-High"
        : anomaly.z_score >= 2
        ? "Medium"
        : "Low",
  }));
}

export function formatRecommendationsForExport(
  recommendations: any[]
): ExportableData[] {
  return recommendations.map((rec) => ({
    Service: rec.service,
    Reason: rec.reason,
    Suggestion: rec.suggestion,
    Priority: rec.suggestion.toLowerCase().includes("investigate")
      ? "High"
      : rec.suggestion.toLowerCase().includes("reduce")
      ? "Medium"
      : "Low",
  }));
}

/**
 * Generates filename with timestamp
 */
export function generateFilename(
  prefix: string,
  extension: string = "csv"
): string {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
  return `${prefix}_${timestamp}.${extension}`;
}
