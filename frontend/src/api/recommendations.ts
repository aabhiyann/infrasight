import axios from "axios";

export interface Recommendation {
  service: string;
  reason: string;
  recommendation: string;
}
export async function fetchRecommendations()(maxBudget?: number, service?: string): Promise<Recommendation[]> {
    try {
        const params = new URLSearchParams();
        if (maxBudget) params.append("maxBudget", maxBudget.toString());
        if (service) params.append("service", service);

        const response = await axios.post<Recommendation[]>("http://localhost:8000/api/recommendations", Object.fromEntries(params));
        return response.data.recommendations;
    } catch (error) {
        console.error("Error fetching recommendations:", error);
        return [];
    }
}

