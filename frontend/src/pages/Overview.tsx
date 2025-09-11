import { useEffect, useState } from "react";
import { fetchCleanedCosts, type CostRecord } from "../api/costApi";
import CostChart from "../components/CostChart";
import HeatmapServiceTrends from "../components/HeatmapServiceTrends";
import MultiServiceTimeline from "../components/MultiServiceTimeline";
import TopServicesBarChart from "../components/TopServicesBarChart";
import OverviewSummary from "../components/OverviewSummary";

function Overview() {
  const [data, setData] = useState<CostRecord[]>([]);
  const [loading, setLoading] = useState(true);

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
      <div className="page-header">
        <h2 className="page-title">AWS Cost Overview</h2>
        <p className="page-subtitle">
          Key spend metrics, trends, and drivers at a glance.
        </p>
      </div>
      <OverviewSummary costData={data} />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div style={{ marginTop: "2rem" }} className="card">
            <h3>Cost Over Time</h3>
            <CostChart data={data} />
          </div>
          <div className="card">
            <MultiServiceTimeline data={data} />
          </div>
          <div className="card">
            <TopServicesBarChart costData={data} />
          </div>
          <div className="card">
            <HeatmapServiceTrends data={data} />
          </div>
        </>
      )}
    </div>
  );
}

export default Overview;
