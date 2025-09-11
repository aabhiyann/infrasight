import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export interface Recommendation {
  service: string;
  reason: string;
  suggestion: string;
}

interface RecommendationRequest {
  service?: string;
  max_budget?: number;
}

export async function fetchRecommendations(
  filters: RecommendationRequest = {}
): Promise<Recommendation[]> {
  try {
    const response = await axios.post<{
      recommendations: Array<{
        service: string;
        total_cost?: number;
        cluster?: number;
        anomaly?: boolean;
        status?: string;
        insights?: string[];
      }>;
    }>(`${BASE_URL}/recommendations`, filters);

    const mapped: Recommendation[] = response.data.recommendations.map((r) => {
      const insights =
        r.insights && r.insights.length > 0 ? r.insights.join("; ") : "";
      const statusPart = r.status ? `Status: ${r.status}.` : "";
      const reason = [statusPart, insights].filter(Boolean).join(" ").trim();

      let suggestion = "Monitor usage.";
      if (r.anomaly) {
        suggestion =
          "Investigate spikes; consider rightsizing or setting budget alerts.";
      } else if (
        typeof r.total_cost === "number" &&
        filters.max_budget &&
        r.total_cost > filters.max_budget
      ) {
        suggestion = "Reduce usage or optimize configuration to meet budget.";
      } else {
        suggestion =
          "Consider commitments (Reserved/Save Plans) if usage is steady.";
      }

      return {
        service: r.service,
        reason,
        suggestion,
      };
    });

    return mapped;
  } catch (error) {
    console.error("Failed to fetch recommendations:", error);
    return [];
  }
}
