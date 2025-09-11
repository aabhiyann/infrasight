import { useEffect, useMemo, useState } from "react";
import type { CostRecord } from "../api/costApi";
import { fetchAnomalies } from "../api/anomalyApi";
import { fetchForecastData } from "../api/forecastApi";

interface OverviewSummaryProps {
  costData: CostRecord[];
}

const formatCurrency = (value: number): string => {
  return `$${value.toFixed(2)}`;
};

const OverviewSummary = ({ costData }: OverviewSummaryProps) => {
  const [anomalyCount, setAnomalyCount] = useState<number>(0);
  const [predictedTomorrow, setPredictedTomorrow] = useState<number | null>(
    null
  );

  useEffect(() => {
    async function loadAux() {
      try {
        const anomalies = await fetchAnomalies();
        setAnomalyCount(anomalies.length);
      } catch {
        setAnomalyCount(0);
      }

      try {
        const forecast = await fetchForecastData(1);
        const value = forecast.total_forecast?.[0]?.predicted_cost ?? null;
        setPredictedTomorrow(value);
      } catch {
        setPredictedTomorrow(null);
      }
    }
    loadAux();
  }, []);

  const { monthTotal, topService } = useMemo(() => {
    if (!costData || costData.length === 0) {
      return { monthTotal: 0, topService: "—" };
    }
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthCosts = costData.filter((r) => {
      const d = new Date(r.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const monthTotalCalc = monthCosts.reduce(
      (sum, r) => sum + (r.amount || 0),
      0
    );

    const perService = new Map<string, number>();
    for (const r of monthCosts) {
      const prev = perService.get(r.service) || 0;
      perService.set(r.service, prev + (r.amount || 0));
    }

    let topServiceName = "—";
    let topServiceValue = -Infinity;
    for (const [service, value] of perService.entries()) {
      if (value > topServiceValue) {
        topServiceValue = value;
        topServiceName = service;
      }
    }

    return { monthTotal: monthTotalCalc, topService: topServiceName };
  }, [costData]);

  return (
    <div className="summary-grid">
      <div className="card">
        <div className="card-title">Total Cost This Month</div>
        <div className="card-value">{formatCurrency(monthTotal)}</div>
      </div>
      <div className="card">
        <div className="card-title">Top Service</div>
        <div className="card-value">{topService}</div>
      </div>
      <div className="card">
        <div className="card-title">Anomalies Detected</div>
        <div className="card-value">{anomalyCount}</div>
      </div>
      <div className="card">
        <div className="card-title">Predicted Tomorrow</div>
        <div className="card-value">
          {predictedTomorrow == null ? "—" : formatCurrency(predictedTomorrow)}
        </div>
      </div>
    </div>
  );
};

export default OverviewSummary;
