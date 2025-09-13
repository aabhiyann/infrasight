import axios from "axios";
import { useApiWithDataSource } from "../hooks/useApiWithDataSource";

export interface CostRecord {
  date: string;
  service: string;
  amount: number;
}

export interface CostApiResponse {
  data: CostRecord[];
  summary: {
    total_records: number;
    date_range: {
      start: string;
      end: string;
    };
    services: string[];
    total_amount: number;
    average_amount: number;
  };
  filters_applied: any;
  data_source: string;
  data_source_info: any;
}

// Base URL - flexible for different environments
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Legacy function for backward compatibility
export async function fetchCleanedCosts(): Promise<CostRecord[]> {
  try {
    const response = await axios.get(`${BASE_URL}/ml/cleaned-costs`);
    return response.data.data; // Extract the data array from the response
  } catch (error) {
    console.error("Failed to fetch cleaned cost data:", error);
    return [];
  }
}

// New hook-based function that respects data source selection
export function useCostApi() {
  const { apiCall } = useApiWithDataSource();

  const fetchCleanedCosts = async (params?: {
    service?: string;
    start_date?: string;
    end_date?: string;
    min_amount?: number;
    max_amount?: number;
    sort_by?: string;
    sort_order?: string;
    limit?: number;
  }): Promise<CostApiResponse> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/ml/cleaned-costs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiCall<CostApiResponse>(endpoint);
  };

  const fetchCostData = async (): Promise<{
    cost_data: CostRecord[];
    data_source: string;
    total_records: number;
    data_source_info: any;
  }> => {
    return apiCall('/cost');
  };

  return {
    fetchCleanedCosts,
    fetchCostData,
  };
}
