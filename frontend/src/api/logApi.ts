import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export interface LogEntry {
  id: number;
  date: string;
  service: string;
  amount: number;
  source?: string;
}

export async function fetchLogs(): Promise<LogEntry[]> {
  try {
    const res = await axios.get<LogEntry[]>(`${BASE_URL}/logs`);
    return res.data;
  } catch (e) {
    console.error("Failed to fetch logs", e);
    return [];
  }
}

export async function updateLog(
  id: number,
  logData: Partial<LogEntry>
): Promise<LogEntry> {
  try {
    const res = await axios.put<{ log: LogEntry }>(
      `${BASE_URL}/log/${id}`,
      logData
    );
    return res.data.log;
  } catch (e) {
    console.error("Failed to update log", e);
    throw e;
  }
}

export async function deleteLog(id: number): Promise<void> {
  try {
    await axios.delete(`${BASE_URL}/log/${id}`);
  } catch (e) {
    console.error("Failed to delete log", e);
    throw e;
  }
}
