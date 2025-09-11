import axios from "axios";

export interface Anomaly {
  date: string;
  service: string;
  amount: number;
  z_score: number;
}

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export async function fetchAnomalies(): Promise<Anomaly[]> {
  try {
    const response = await axios.get<{ data: Anomaly[] }>(
      `${BASE_URL}/anomalies`
    );
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch anomalies:", error);
    return [];
  }
}
