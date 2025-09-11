import { useState, useEffect } from "react";
import {
  fetchRecommendations,
  type Recommendation,
} from "../api/recommendations";

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const result = await fetchRecommendations();
      setRecommendations(result);
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Cost-Saving Recommendations</h2>
      {loading ? (
        <p>Loading recommendations...</p>
      ) : recommendations.length === 0 ? (
        <p>No recommendations found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f5f5f5" }}>
              <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                Service
              </th>
              <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                Reason
              </th>
              <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                Suggestion
              </th>
            </tr>
          </thead>
          <tbody>
            {recommendations.map((rec, index) => (
              <tr key={index}>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  {rec.service}
                </td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  {rec.reason}
                </td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  {rec.recommendation}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
