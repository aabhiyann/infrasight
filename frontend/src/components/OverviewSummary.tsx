import { useEffect, useMemo, useState } from "react";
import type { CostRecord } from "../api/costApi";
import { useAnomalyApi } from "../api/anomalyApi";
import { fetchForecastData } from "../api/forecastApi";

interface OverviewSummaryProps {
  costData: CostRecord[];
}

const formatCurrency = (value: number): string => {
  return `$${value.toFixed(2)}`;
};

const OverviewSummary = ({ costData }: OverviewSummaryProps) => {
  const { fetchAnomalies } = useAnomalyApi();
  const [anomalyCount, setAnomalyCount] = useState<number>(0);
  const [predictedTomorrow, setPredictedTomorrow] = useState<number | null>(
    null
  );

  useEffect(() => {
    async function loadAux() {
      try {
        // Calculate the same 30-day date range for anomalies as we use for costs
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 30);

        // Format dates for API call
        const startDateStr = startDate.toISOString().split("T")[0];
        const endDateStr = endDate.toISOString().split("T")[0];

        const anomalies = await fetchAnomalies(2.0, {
          start_date: startDateStr,
          end_date: endDateStr,
        });
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
  }, [costData]); // Re-run when cost data changes (e.g., data source toggle)

  const { monthTotal, topService } = useMemo(() => {
    if (!costData || costData.length === 0) {
      return { monthTotal: 0, topService: "—" };
    }

    // Calculate last 30 days date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);

    const last30DaysCosts = costData.filter((r) => {
      const d = new Date(r.date);
      return d >= startDate && d <= endDate;
    });

    const monthTotalCalc = last30DaysCosts.reduce(
      (sum, r) => sum + (r.amount || 0),
      0
    );

    const perService = new Map<string, number>();
    for (const r of last30DaysCosts) {
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
        <div className="card-title">Total Cost Last 30 Days</div>
        <div className="card-value">{formatCurrency(monthTotal)}</div>
      </div>
      <div className="card">
        <div className="card-title">Top Service (Last 30 Days)</div>
        <div className="card-value">{topService}</div>
      </div>
      <div className="card">
        <div className="card-title">Anomalies Detected (Last 30 Days)</div>
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
