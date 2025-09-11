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
    const response = await axios.post<{ recommendations: Recommendation[] }>(
      `${BASE_URL}/recommendations`,
      filters
    );
    return response.data.recommendations;
  } catch (error) {
    console.error("Failed to fetch recommendations:", error);
    return [];
  }
}
