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
