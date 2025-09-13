import { useDataSource, buildApiUrl } from '../contexts/DataSourceContext';
import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

// Base URL - flexible for different environments
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

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
