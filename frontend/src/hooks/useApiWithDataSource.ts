import { useDataSource, buildApiUrl } from "../contexts/DataSourceContext";
import axios from "axios";
import type { AxiosRequestConfig } from "axios";

// Base URL - normalize so it ALWAYS ends with /api
const RAW_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
const BASE_URL = `${RAW_BASE.replace(/\/+$/, "")}`.endsWith("/api")
  ? `${RAW_BASE.replace(/\/+$/, "")}`
  : `${RAW_BASE.replace(/\/+$/, "")}/api`;

export const useApiWithDataSource = () => {
  const { dataSource } = useDataSource();

  // Helper function to make API calls with data source parameter
  const apiCall = async <T>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const url = buildApiUrl(`${BASE_URL}${endpoint}`, dataSource);
    const response = await axios.get<T>(url, config);
    return response.data;
  };

  // Helper function for POST requests
  const apiPost = async <T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const url = buildApiUrl(`${BASE_URL}${endpoint}`, dataSource);
    const response = await axios.post<T>(url, data, config);
    return response.data;
  };

  // Helper function for PUT requests
  const apiPut = async <T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const url = buildApiUrl(`${BASE_URL}${endpoint}`, dataSource);
    const response = await axios.put<T>(url, data, config);
    return response.data;
  };

  // Helper function for DELETE requests
  const apiDelete = async <T>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const url = buildApiUrl(`${BASE_URL}${endpoint}`, dataSource);
    const response = await axios.delete<T>(url, config);
    return response.data;
  };

  return {
    apiCall,
    apiPost,
    apiPut,
    apiDelete,
    dataSource,
    baseUrl: BASE_URL,
  };
};
