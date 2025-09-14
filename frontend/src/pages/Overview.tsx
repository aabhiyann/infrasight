import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCostApi, type CostRecord } from "../api/costApi";
import { useDataSource } from "../contexts/DataSourceContext";
import CostChart from "../components/CostChart";
import ServiceFilterDropdown from "../components/ServiceFilterDropdown";
import DateRangePicker, { type DateRange } from "../components/DateRangePicker";
import ChartCard from "../components/ChartCard";
import HeatmapServiceTrends from "../components/HeatmapServiceTrends";
import MultiServiceTimeline from "../components/MultiServiceTimeline";
import TopServicesBarChart from "../components/TopServicesBarChart";
import OverviewSummary from "../components/OverviewSummary";
import Skeleton from "../components/Skeleton";
import EmptyState from "../components/EmptyState";
import { RefreshCw } from "lucide-react";
import { useToast } from "../components/ui/Toast";
import { usePageTitle } from "../hooks/usePageTitle";

function Overview() {
  usePageTitle("Overview");
  const { fetchCleanedCosts } = useCostApi();
  const { dataSource } = useDataSource();
  const [data, setData] = useState<CostRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    end: new Date(),
  });
  const location = useLocation();
  const navigate = useNavigate();
  const { notify } = useToast();

  // Read service filter from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const service = params.get("service") || "";
    if (service) setSelectedService(service);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep URL in sync when selectedService changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (selectedService) params.set("service", selectedService);
    else params.delete("service");
    navigate({ search: params.toString() }, { replace: true });
  }, [selectedService, location.search, navigate]);

  const loadData = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await fetchCleanedCosts({
        start_date: dateRange.start.toISOString().split("T")[0],
        end_date: dateRange.end.toISOString().split("T")[0],
      });
      setData(response.data);
    } catch (err) {
      setError("Failed to load cost data. Please try again.");
      notify("Failed to load cost data", "error");
    } finally {
      setLoading(false);
      notify("Overview refreshed", "success", 1800);
    }
  };

  useEffect(() => {
    loadData();
  }, [dataSource, dateRange]); // Reload when data source or date range changes

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
        <div className="d-flex items-center gap-md">
          <label htmlFor="service">Service:</label>
          <ServiceFilterDropdown
            selected={selectedService}
            onChange={setSelectedService}
          />
        </div>
        <div className="d-flex items-center gap-md">
          <label htmlFor="date-range">Date Range:</label>
          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </div>
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
