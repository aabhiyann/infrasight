import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type DataSource = 'mock' | 'real' | 'auto';

interface DataSourceContextType {
  dataSource: DataSource;
  setDataSource: (source: DataSource) => void;
  isRealData: boolean;
  dataSourceInfo: any;
  loading: boolean;
  error: string | null;
  refreshDataSourceInfo: () => Promise<void>;
}

const DataSourceContext = createContext<DataSourceContextType | undefined>(undefined);

interface DataSourceProviderProps {
  children: ReactNode;
}

export const DataSourceProvider: React.FC<DataSourceProviderProps> = ({ children }) => {
  const [dataSource, setDataSourceState] = useState<DataSource>('auto');
  const [dataSourceInfo, setDataSourceInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data source status from backend
  const fetchDataSourceInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/data-source/status');
      if (!response.ok) {
        throw new Error('Failed to fetch data source status');
      }
      const info = await response.json();
      setDataSourceInfo(info);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching data source info:', err);
    } finally {
      setLoading(false);
    }
  };

  // Refresh data source info
  const refreshDataSourceInfo = async () => {
    await fetchDataSourceInfo();
  };

  // Set data source and update backend if needed
  const setDataSource = (source: DataSource) => {
    setDataSourceState(source);
    // Note: We don't need to update backend here since we'll use URL parameters
    // The backend will use the URL parameter to override the environment setting
  };

  // Calculate if we're using real data
  const isRealData = dataSource === 'real' || (dataSource === 'auto' && dataSourceInfo?.current_source === 'real');

  // Load initial data source info
  useEffect(() => {
    fetchDataSourceInfo();
  }, []);

  const value: DataSourceContextType = {
    dataSource,
    setDataSource,
    isRealData,
    dataSourceInfo,
    loading,
    error,
    refreshDataSourceInfo,
  };

  return (
    <DataSourceContext.Provider value={value}>
      {children}
    </DataSourceContext.Provider>
  );
};

export const useDataSource = (): DataSourceContextType => {
  const context = useContext(DataSourceContext);
  if (context === undefined) {
    throw new Error('useDataSource must be used within a DataSourceProvider');
  }
  return context;
};

// Helper function to build API URLs with data source parameter
export const buildApiUrl = (baseUrl: string, dataSource: DataSource): string => {
  if (dataSource === 'auto') {
    return baseUrl; // Use backend's default (environment setting)
  }
  return `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}source=${dataSource}`;
};
