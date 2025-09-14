import axios from "axios";
import { useApiWithDataSource } from "../hooks/useApiWithDataSource";
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

// New hook-based function that respects data source selection
export function useAnomalyApi() {
  const { apiCall } = useApiWithDataSource();

  const fetchAnomalies = async (
    z_threshold: number = 2.0,
    params?: {
      start_date?: string;
      end_date?: string;
      service?: string;
    }
  ): Promise<Anomaly[]> => {
    const queryParams = new URLSearchParams();
    queryParams.append("z_threshold", z_threshold.toString());

    if (params) {
      if (params.start_date)
        queryParams.append("start_date", params.start_date);
      if (params.end_date) queryParams.append("end_date", params.end_date);
      if (params.service) queryParams.append("service", params.service);
    }

    const endpoint = `/anomalies?${queryParams.toString()}`;
    const response = await apiCall<{
      flattened_anomalies: Anomaly[];
      summary: {
        total_anomalies: number;
        services_affected: number;
        services: string[];
      };
      threshold_used: number;
      status: string;
    }>(endpoint);

    return response.flattened_anomalies;
  };

  return {
    fetchAnomalies,
  };
}
