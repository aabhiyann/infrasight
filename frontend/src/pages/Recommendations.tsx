import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "../components/ui/Toast";
import {
  useRecommendationApi,
  type Recommendation,
} from "../api/recommendationApi";
import { useForecastApi } from "../api/forecastApi";
import { useDataSource } from "../contexts/DataSourceContext";
import ServiceSelector from "../components/ServiceSelector";
import RecommendationTable from "../components/RecommendationTable";
import Skeleton from "../components/Skeleton";
import EmptyState from "../components/EmptyState";

const Recommendations = () => {
  const { fetchRecommendations } = useRecommendationApi();
  const { fetchAvailableServices } = useForecastApi();
  const { dataSource } = useDataSource();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  const [services, setServices] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState<string>("");
  const [budget, setBudget] = useState<number | "">("");

  const location = useLocation();
  const navigate = useNavigate();
  const { notify } = useToast();

  useEffect(() => {
    fetchAvailableServices().then(setServices);
  }, [dataSource]); // Reload services when data source changes

  useEffect(() => {
    loadRecommendations();
  }, [dataSource]); // Reload recommendations when data source changes

  async function loadRecommendations() {
    setLoading(true);
    const filters = {
      ...(selectedService && { service: selectedService }),
      ...(budget !== "" && { max_budget: Number(budget) }),
    };
    const result = await fetchRecommendations(filters);
    setRecommendations(result);
    setLoading(false);
    notify("Recommendations updated", "success", 2200);
  }

  // URL sync: service and budget
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const service = params.get("service") || "";
    const b = params.get("budget");
    if (service) setSelectedService(service);
    if (b !== null && b !== "") setBudget(Number(b));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (selectedService) params.set("service", selectedService);
    else params.delete("service");
    if (budget !== "") params.set("budget", String(budget));
    else params.delete("budget");
    navigate({ search: params.toString() }, { replace: true });
  }, [selectedService, budget, location.search, navigate]);

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

        <button
          className="btn d-flex items-center gap-sm"
          onClick={loadRecommendations}
          aria-label="Apply Filters"
          title="Apply Filters"
        >
          <span className="hide-sm-text">Apply Filters</span>
        </button>
      </div>

      {/* Results */}
      {loading ? (
        <div className="card">
          <Skeleton height={220} />
        </div>
      ) : recommendations.length === 0 ? (
        <div className="card">
          <EmptyState
            title="No recommendations"
            message="Adjust filters or try another service."
            icon="alert"
            onRetry={loadRecommendations}
          />
        </div>
      ) : (
        <div className="card">
          <RecommendationTable recommendations={recommendations} />
        </div>
      )}
    </div>
  );
};

export default Recommendations;
