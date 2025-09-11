import axios from "axios";

export interface Anomaly {
  date: string;
  service: string;
  amount: number;
  z_score: number;
}

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export async function fetchAnomalies(
  z_threshold: number = 2.0
): Promise<Anomaly[]> {
  try {
    const response = await axios.get<{
      flattened_anomalies: Anomaly[];
      summary: {
        total_anomalies: number;
        services_affected: number;
        services: string[];
      };
      threshold_used: number;
      status: string;
    }>(`${BASE_URL}/anomalies?z_threshold=${z_threshold}`);

    return response.data.flattened_anomalies;
  } catch (error) {
    console.error("Failed to fetch anomalies:", error);
    return [];
  }
}
