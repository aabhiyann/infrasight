interface Recommendation {
  service: string;
  reason: string;
  suggestion: string;
}

interface Props {
  recommendations: Recommendation[];
}

const RecommendationTable = ({ recommendations }: Props) => {
  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>Recommendations</h3>
      {recommendations.length === 0 ? (
        <p>No recommendations available.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            className="table table--sticky table--compact"
            style={{ marginTop: "1rem" }}
          >
            <thead>
              <tr>
                <th>Service</th>
                <th>Reason</th>
                <th>Suggestion</th>
              </tr>
            </thead>
            <tbody>
              {recommendations.map((rec, idx) => (
                <tr key={idx}>
                  <td>{rec.service}</td>
                  <td>{rec.reason}</td>
                  <td>{rec.suggestion}</td>
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
