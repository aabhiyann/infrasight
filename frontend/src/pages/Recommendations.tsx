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
    <div className="container stack-lg">
      <div className="page-header">
        <h2 className="page-title">AI Recommendations</h2>
        <p className="page-subtitle">
          Actionable ways to reduce spend and improve efficiency.
        </p>
      </div>

      {/* Filters */}
      <div className="toolbar">
        <ServiceSelector
          services={services}
          selectedService={selectedService}
          onChange={setSelectedService}
        />

        <label>
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

        <button onClick={loadRecommendations}>Apply Filters</button>
      </div>

      {/* Results */}
      {loading ? (
        <p>Loading recommendations...</p>
      ) : recommendations.length === 0 ? (
        <p>No recommendations found.</p>
      ) : (
        <div className="card">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "var(--color-bg)" }}>
                <th
                  style={{
                    padding: "8px",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  Service
                </th>
                <th
                  style={{
                    padding: "8px",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  Reason
                </th>
                <th
                  style={{
                    padding: "8px",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  Suggestion
                </th>
              </tr>
            </thead>
            <tbody>
              {recommendations.map((r, i) => (
                <tr key={i}>
                  <td
                    style={{
                      padding: "8px",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    {r.service}
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    {r.reason}
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    {r.suggestion}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Recommendations;
