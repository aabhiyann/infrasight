import axios from "axios";

export interface CostRecord {
  date: string;
  service: string;
  amount: number;
}

// Base URL
const BASE_URL = "http://localhost:8000/api";

export async function fetchCleanedCosts(): Promise<CostRecord[]> {
  try {
    const response = await axios.get(`${BASE_URL}/ml/cleaned-costs`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch cleaned cost data:", error);
    return [];
  }
}
