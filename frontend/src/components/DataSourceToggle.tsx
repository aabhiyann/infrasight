import React from 'react';
import { Box, Flex } from './ui';
import { useDataSource, DataSource } from '../contexts/DataSourceContext';
import { useToast } from './ui/Toast';

const DataSourceToggle: React.FC = () => {
  const { dataSource, setDataSource, isRealData, dataSourceInfo, loading, error } = useDataSource();
  const { toast } = useToast();

  const handleToggle = (source: DataSource) => {
    setDataSource(source);
    
    // Show feedback toast
    const sourceLabel = source === 'mock' ? 'Mock Data' : 
                       source === 'real' ? 'Real AWS Data' : 'Auto (Backend Default)';
    
    toast({
      title: "Data Source Changed",
      description: `Switched to ${sourceLabel}`,
      variant: "default",
    });
  };

  const getStatusColor = () => {
    if (loading) return 'var(--color-text-muted)';
    if (error) return 'var(--color-error)';
    if (isRealData) return 'var(--color-success)';
    return 'var(--color-warning)';
  };

  const getStatusIcon = () => {
    if (loading) return '⏳';
    if (error) return '❌';
    if (isRealData) return '☁️';
    return '🎭';
  };

  const getStatusText = () => {
    if (loading) return 'Loading...';
    if (error) return 'Error';
    if (isRealData) return 'Real AWS Data';
    return 'Mock Data';
  };

  return (
    <Box className="data-source-toggle">
      <Flex align="center" gap="sm" style={{ flexWrap: 'wrap' }}>
        {/* Status Indicator */}
        <Flex align="center" gap="xs" style={{ fontSize: '0.875rem' }}>
          <span style={{ color: getStatusColor() }}>
            {getStatusIcon()}
          </span>
          <span style={{ color: getStatusColor(), fontWeight: 500 }}>
            {getStatusText()}
          </span>
        </Flex>

        {/* Toggle Buttons */}
        <Flex align="center" gap="xs">
          <button
            onClick={() => handleToggle('mock')}
            className={`data-source-btn ${dataSource === 'mock' ? 'active' : ''}`}
            style={{
              padding: '4px 8px',
              fontSize: '0.75rem',
              borderRadius: '4px',
              border: '1px solid var(--color-border)',
              background: dataSource === 'mock' ? 'var(--color-primary)' : 'var(--color-surface)',
              color: dataSource === 'mock' ? 'var(--color-primary-foreground)' : 'var(--color-text)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            disabled={loading}
          >
            🎭 Mock
          </button>

          <button
            onClick={() => handleToggle('real')}
            className={`data-source-btn ${dataSource === 'real' ? 'active' : ''}`}
            style={{
              padding: '4px 8px',
              fontSize: '0.75rem',
              borderRadius: '4px',
              border: '1px solid var(--color-border)',
              background: dataSource === 'real' ? 'var(--color-primary)' : 'var(--color-surface)',
              color: dataSource === 'real' ? 'var(--color-primary-foreground)' : 'var(--color-text)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            disabled={loading}
          >
            ☁️ Real
          </button>

          <button
            onClick={() => handleToggle('auto')}
            className={`data-source-btn ${dataSource === 'auto' ? 'active' : ''}`}
            style={{
              padding: '4px 8px',
              fontSize: '0.75rem',
              borderRadius: '4px',
              border: '1px solid var(--color-border)',
              background: dataSource === 'auto' ? 'var(--color-primary)' : 'var(--color-surface)',
              color: dataSource === 'auto' ? 'var(--color-primary-foreground)' : 'var(--color-text)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            disabled={loading}
          >
            🔄 Auto
          </button>
        </Flex>

        {/* Connection Status */}
        {dataSourceInfo?.aws_connection && (
          <Flex align="center" gap="xs" style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            <span>
              {dataSourceInfo.aws_connection.status === 'success' ? '✅' : '❌'}
            </span>
            <span>
              AWS: {dataSourceInfo.aws_connection.status === 'success' ? 'Connected' : 'Disconnected'}
            </span>
          </Flex>
        )}
      </Flex>

      {/* Error Message */}
      {error && (
        <Box style={{ 
          marginTop: '4px', 
          fontSize: '0.75rem', 
          color: 'var(--color-error)',
          background: 'var(--color-error-subtle)',
          padding: '4px 8px',
          borderRadius: '4px',
        }}>
          ⚠️ {error}
        </Box>
      )}

      {/* Additional Info */}
      {dataSourceInfo && !error && (
        <Box style={{ 
          marginTop: '4px', 
          fontSize: '0.75rem', 
          color: 'var(--color-text-muted)',
        }}>
          Backend default: {dataSourceInfo.use_real_data_env === 'true' ? 'Real Data' : 'Mock Data'}
          {dataSourceInfo.aws_connection?.available_services && (
            <span> • {dataSourceInfo.aws_connection.available_services} AWS services available</span>
          )}
        </Box>
      )}

      <style jsx>{`
        .data-source-btn:hover:not(:disabled) {
          background: var(--color-primary-subtle) !important;
          border-color: var(--color-primary) !important;
        }

        .data-source-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .data-source-btn.active {
          box-shadow: 0 0 0 2px var(--color-primary-subtle);
        }

        @media (max-width: 768px) {
          .data-source-toggle {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
        }
      `}</style>
    </Box>
  );
};

export default DataSourceToggle;
