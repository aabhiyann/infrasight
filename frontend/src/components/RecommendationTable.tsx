interface Recommendation {
  service: string;
  reason: string;
  suggestion: string;
}

interface Props {
  recommendations: Recommendation[];
}

const cellStyle: React.CSSProperties = {
  border: "1px solid #dee2e6",
  padding: "0.75rem",
  textAlign: "left",
};

const RecommendationTable = ({ recommendations }: Props) => {
  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>Recommendations</h3>
      {recommendations.length === 0 ? (
        <p>No recommendations available.</p>
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
                <th style={cellStyle}>Service</th>
                <th style={cellStyle}>Reason</th>
                <th style={cellStyle}>Suggestion</th>
              </tr>
            </thead>
            <tbody>
              {recommendations.map((rec, idx) => (
                <tr key={idx}>
                  <td style={cellStyle}>{rec.service}</td>
                  <td style={cellStyle}>{rec.reason}</td>
                  <td style={cellStyle}>{rec.suggestion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecommendationTable;
