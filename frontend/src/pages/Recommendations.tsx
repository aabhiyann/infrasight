import { useEffect, useState } from "react";
import {
  fetchRecommendations,
  type Recommendation,
} from "../api/recommendationApi";
import { fetchAvailableServices } from "../api/forecastApi";
import ServiceSelector from "../components/ServiceSelector";

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  const [services, setServices] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState<string>("");
  const [budget, setBudget] = useState<number | "">("");

  useEffect(() => {
    fetchAvailableServices().then(setServices);
  }, []);

  useEffect(() => {
    loadRecommendations();
  }, []);

  async function loadRecommendations() {
    setLoading(true);
    const filters = {
      ...(selectedService && { service: selectedService }),
      ...(budget !== "" && { max_budget: Number(budget) }),
    };
    const result = await fetchRecommendations(filters);
    setRecommendations(result);
    setLoading(false);
  }

  return (
    <div className="container">
      <h2>AI Recommendations</h2>

      {/* Filters */}
      <div style={{ marginBottom: "1rem" }}>
        <ServiceSelector
          services={services}
          selectedService={selectedService}
          onChange={setSelectedService}
        />

        <label style={{ marginLeft: "1rem" }}>
          Max Budget:{" "}
          <input
            type="number"
            placeholder="Optional"
            value={budget}
            onChange={(e) =>
              setBudget(e.target.value === "" ? "" : Number(e.target.value))
            }
          />
        </label>

        <button onClick={loadRecommendations} style={{ marginLeft: "1rem" }}>
          Apply Filters
        </button>
      </div>

      {/* Results */}
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
            {recommendations.map((r, i) => (
              <tr key={i}>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  {r.service}
                </td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  {r.reason}
                </td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  {r.suggestion}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Recommendations;
