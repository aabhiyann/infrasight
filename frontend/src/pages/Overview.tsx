import React, { useEffect, useState } from "react";
import { fetchCleanedCosts, type CostRecord } from "../api/costApi";
import CostChart from "../components/CostChart";
import BarChartTopServices from "../components/BarChartTopServices";
import HeatmapServiceTrends from "../components/HeatmapServiceTrends";

const Overview: React.FC = () => {
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
    <div style={{ padding: "2rem" }}>
      <h2>AWS Cost Overview</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <CostChart data={data} />
          <BarChartTopServices data={data} />
          <HeatmapServiceTrends data={data} />
        </>
      )}
    </div>
  );
};

export default Overview;
