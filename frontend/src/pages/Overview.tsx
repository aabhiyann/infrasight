import { useEffect, useState } from "react";
import { fetchCleanedCosts, type CostRecord } from "../api/costApi";
import CostChart from "../components/CostChart";
import ServiceFilterDropdown from "../components/ServiceFilterDropdown";
import ChartCard from "../components/ChartCard";
import HeatmapServiceTrends from "../components/HeatmapServiceTrends";
import MultiServiceTimeline from "../components/MultiServiceTimeline";
import TopServicesBarChart from "../components/TopServicesBarChart";
import OverviewSummary from "../components/OverviewSummary";
import Skeleton from "../components/Skeleton";
import EmptyState from "../components/EmptyState";
import { RefreshCw } from "lucide-react";
import { usePageTitle } from "../hooks/usePageTitle";

function Overview() {
  usePageTitle("Overview");
  const [data, setData] = useState<CostRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string>("");

  const loadData = async () => {
    try {
      setError(null);
      setLoading(true);
      const result = await fetchCleanedCosts();
      setData(result);
    } catch (err) {
      setError("Failed to load cost data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="container stack-lg">
      <div className="page-header">
        <h2 className="page-title">AWS Cost Overview</h2>
        <p className="page-subtitle">
          Key spend metrics, trends, and drivers at a glance.
        </p>
      </div>
      <OverviewSummary costData={data} />
      <div className="toolbar">
        <label htmlFor="service">Service:</label>
        <ServiceFilterDropdown
          selected={selectedService}
          onChange={setSelectedService}
        />
        <button
          onClick={loadData}
          disabled={loading}
          className="btn btn-secondary d-flex items-center gap-sm"
          aria-label={loading ? "Refreshing" : "Refresh"}
          title={loading ? "Refreshing" : "Refresh"}
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          <span className="hide-sm-text">
            {loading ? "Refreshing..." : "Refresh"}
          </span>
        </button>
      </div>
      {loading ? (
        <div className="card">
          <Skeleton height={200} />
        </div>
      ) : error ? (
        <div className="card">
          <EmptyState
            title="Error loading data"
            message={error}
            icon="alert"
            onRetry={loadData}
          />
        </div>
      ) : data.length === 0 ? (
        <div className="card">
          <EmptyState
            title="No data available"
            message="No cost data found. Please check back later."
            icon="alert"
            onRetry={loadData}
          />
        </div>
      ) : (
        <>
          <ChartCard title="Cost Over Time">
            <CostChart data={data} serviceFilter={selectedService} />
          </ChartCard>
          <ChartCard title="Service Timelines">
            <MultiServiceTimeline data={data} />
          </ChartCard>
          <ChartCard title="Top 5 Services This Month (by Total Cost)">
            <TopServicesBarChart costData={data} hideTitle />
          </ChartCard>
          <ChartCard title="Service Trend Heatmap">
            <HeatmapServiceTrends data={data} />
          </ChartCard>
        </>
      )}
    </div>
  );
}

export default Overview;
