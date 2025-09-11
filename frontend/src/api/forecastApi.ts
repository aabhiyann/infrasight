import axios from "axios";

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

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

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
