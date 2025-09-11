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
            className="input"
            type="number"
            placeholder="Optional"
            value={budget}
            onChange={(e) =>
              setBudget(e.target.value === "" ? "" : Number(e.target.value))
            }
          />
        </label>

        <button className="btn" onClick={loadRecommendations}>
          Apply Filters
        </button>
      </div>

      {/* Results */}
      {loading ? (
        <p>Loading recommendations...</p>
      ) : recommendations.length === 0 ? (
        <p>No recommendations found.</p>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Reason</th>
                <th>Suggestion</th>
              </tr>
            </thead>
            <tbody>
              {recommendations.map((r, i) => (
                <tr key={i}>
                  <td>{r.service}</td>
                  <td>{r.reason}</td>
                  <td>{r.suggestion}</td>
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
