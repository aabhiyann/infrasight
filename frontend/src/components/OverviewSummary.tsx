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
        // Calculate the same adaptive date range for anomalies as we use for costs
        if (costData && costData.length > 0) {
          const allDates = costData.map(r => new Date(r.date));
          const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())));
          const minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
          
          const daysInData = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
          const daysToShow = Math.min(30, daysInData);
          
          const startDate = new Date(maxDate);
          startDate.setDate(maxDate.getDate() - daysToShow + 1);

          // Format dates for API call
          const startDateStr = startDate.toISOString().split("T")[0];
          const endDateStr = maxDate.toISOString().split("T")[0];

          const anomalies = await fetchAnomalies(2.0, {
            start_date: startDateStr,
            end_date: endDateStr,
          });
          setAnomalyCount(anomalies.length);
        } else {
          setAnomalyCount(0);
        }
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
    
    // Find the actual date range in the data
    const allDates = costData.map(r => new Date(r.date));
    const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())));
    const minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
    
    // Use the most recent 30 days of available data, or all data if less than 30 days
    const daysInData = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysToShow = Math.min(30, daysInData);
    
    const startDate = new Date(maxDate);
    startDate.setDate(maxDate.getDate() - daysToShow + 1); // +1 to include the max date

    const recentCosts = costData.filter((r) => {
      const d = new Date(r.date);
      return d >= startDate && d <= maxDate;
    });

    const monthTotalCalc = recentCosts.reduce(
      (sum, r) => sum + (r.amount || 0),
      0
    );

    const perService = new Map<string, number>();
    for (const r of recentCosts) {
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

  // Calculate dynamic label based on actual data range
  const getDateRangeLabel = () => {
    if (!costData || costData.length === 0) return "Recent";
    
    const allDates = costData.map(r => new Date(r.date));
    const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())));
    const minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
    
    const daysInData = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysToShow = Math.min(30, daysInData);
    
    if (daysToShow < 30) {
      return `Recent ${daysToShow} Days`;
    } else {
      return "Last 30 Days";
    }
  };

  const dateRangeLabel = getDateRangeLabel();

  return (
    <div className="summary-grid">
      <div className="card">
        <div className="card-title">Total Cost {dateRangeLabel}</div>
        <div className="card-value">{formatCurrency(monthTotal)}</div>
      </div>
      <div className="card">
        <div className="card-title">Top Service ({dateRangeLabel})</div>
        <div className="card-value">{topService}</div>
      </div>
      <div className="card">
        <div className="card-title">Anomalies Detected ({dateRangeLabel})</div>
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
