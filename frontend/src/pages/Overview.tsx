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
    <div className="container">
      <h2>AWS Cost Overview</h2>
      <OverviewSummary costData={data} />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div style={{ marginTop: "2rem" }}>
            <h3>Cost Over Time</h3>
            <div className="chart-container">
              <CostChart data={data} />
            </div>
          </div>
          <MultiServiceTimeline data={data} />
          <TopServicesBarChart costData={data} />
          <HeatmapServiceTrends data={data} />
        </>
      )}
    </div>
  );
}

export default Overview;
