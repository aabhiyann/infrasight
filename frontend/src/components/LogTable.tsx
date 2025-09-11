interface LogEntry {
  id: number;
  date: string;
  service: string;
  amount: number;
  source?: string;
}

interface Props {
  logs: LogEntry[];
}

const cellStyle: React.CSSProperties = {
  border: "1px solid #dee2e6",
  padding: "0.75rem",
  textAlign: "left",
};

const LogTable = ({ logs }: Props) => {
  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>Database Logs</h3>
      {logs.length === 0 ? (
        <p>No logs found.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "1rem",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#e9ecef" }}>
                <th style={cellStyle}>Date</th>
                <th style={cellStyle}>Service</th>
                <th style={cellStyle}>Amount ($)</th>
                <th style={cellStyle}>Source</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td style={cellStyle}>
                    {new Date(log.date).toLocaleString()}
                  </td>
                  <td style={cellStyle}>{log.service}</td>
                  <td style={cellStyle}>{log.amount.toFixed(2)}</td>
                  <td style={cellStyle}>{log.source ?? "db"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LogTable;
