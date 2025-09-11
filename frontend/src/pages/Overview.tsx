import { useEffect, useState } from "react";
import { fetchCleanedCosts, type CostRecord } from "../api/costApi";
import CostChart from "../components/CostChart";
import ServiceFilterDropdown from "../components/ServiceFilterDropdown";
import ChartCard from "../components/ChartCard";
import HeatmapServiceTrends from "../components/HeatmapServiceTrends";
import MultiServiceTimeline from "../components/MultiServiceTimeline";
import TopServicesBarChart from "../components/TopServicesBarChart";
import OverviewSummary from "../components/OverviewSummary";
import Breadcrumb from "../components/Breadcrumb";
import Skeleton from "../components/Skeleton";

function Overview() {
  const [data, setData] = useState<CostRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<string>("");

  useEffect(() => {
    async function loadData() {
      const result = await fetchCleanedCosts();
      setData(result);
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="container stack-lg">
      <Breadcrumb items={[{ label: "AWS Cost Overview" }]} />
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
      </div>
      {loading ? (
        <div className="card">
          <Skeleton height={200} />
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
