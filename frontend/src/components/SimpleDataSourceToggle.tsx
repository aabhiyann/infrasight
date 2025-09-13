import React from 'react';

const SimpleDataSourceToggle: React.FC = () => {
  const [dataSource, setDataSource] = React.useState<'mock' | 'real' | 'auto'>('auto');

  return (
    <div style={{ 
      padding: '8px', 
      border: '1px solid #ccc', 
      borderRadius: '4px',
      display: 'flex',
      gap: '8px',
      alignItems: 'center'
    }}>
      <span>Data Source:</span>
      <button 
        onClick={() => setDataSource('mock')}
        style={{
          padding: '4px 8px',
          backgroundColor: dataSource === 'mock' ? '#007bff' : '#f8f9fa',
          color: dataSource === 'mock' ? 'white' : 'black',
          border: '1px solid #ccc',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        🎭 Mock
      </button>
      <button 
        onClick={() => setDataSource('real')}
        style={{
          padding: '4px 8px',
          backgroundColor: dataSource === 'real' ? '#007bff' : '#f8f9fa',
          color: dataSource === 'real' ? 'white' : 'black',
          border: '1px solid #ccc',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        ☁️ Real
      </button>
      <button 
        onClick={() => setDataSource('auto')}
        style={{
          padding: '4px 8px',
          backgroundColor: dataSource === 'auto' ? '#007bff' : '#f8f9fa',
          color: dataSource === 'auto' ? 'white' : 'black',
          border: '1px solid #ccc',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        🔄 Auto
      </button>
      <span style={{ fontSize: '12px', color: '#666' }}>
        Current: {dataSource}
      </span>
    </div>
  );
};

export default SimpleDataSourceToggle;
