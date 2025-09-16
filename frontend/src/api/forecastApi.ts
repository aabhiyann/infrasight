import axios from "axios";
import { useApiWithDataSource } from "../hooks/useApiWithDataSource";

export interface ForecastPoint {
  date: string;
  predicted_cost: number;
  lower_bound: number;
  upper_bound: number;
}

export interface ForecastSummary {
  forecast_period_days: number;
  services_forecasted: number;
  services: string[];
}

export interface ForecastResponse {
  service_forecasts: Record<string, ForecastPoint[]>;
  total_forecast: ForecastPoint[];
  summary: ForecastSummary;
  status: string;
}

const RAW_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
const BASE_URL = `${RAW_BASE.replace(/\/+$/, "")}`.endsWith("/api")
  ? `${RAW_BASE.replace(/\/+$/, "")}`
  : `${RAW_BASE.replace(/\/+$/, "")}/api`;

export async function fetchForecastData(
  n_days: number = 7,
  service?: string
): Promise<ForecastResponse> {
  try {
    const params = new URLSearchParams();
    params.append("n_days", n_days.toString());
    if (service) {
      params.append("service", service);
    }

    const response = await axios.get<ForecastResponse>(
      `${BASE_URL}/forecast?${params}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch forecast data:", error);
    throw error;
  }
}

export async function fetchAvailableServices(): Promise<string[]> {
  try {
    const response = await axios.get<{ services: string[] }>(
      `${BASE_URL}/forecast/services`
    );
    return response.data.services;
  } catch (error) {
    console.error("Failed to fetch available services:", error);
    return [];
  }
}

// New hook-based functions that respect data source selection
export function useForecastApi() {
  const { apiCall } = useApiWithDataSource();

  const fetchForecastData = async (
    n_days: number = 7,
    service?: string
  ): Promise<ForecastResponse> => {
    const params = new URLSearchParams();
    params.append("n_days", n_days.toString());
    if (service) params.append("service", service);

    const endpoint = `/forecast?${params}`;
    return apiCall<ForecastResponse>(endpoint);
  };

  const fetchAvailableServices = async (): Promise<string[]> => {
    const response = await apiCall<{ services: string[] }>(
      "/forecast/services"
    );
    return response.services || [];
  };

  return {
    fetchForecastData,
    fetchAvailableServices,
  };
}
