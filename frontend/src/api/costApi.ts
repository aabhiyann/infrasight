import axios from "axios";

export interface CostRecord {
  date: string;
  service: string;
  amount: number;
}

// Base URL - flexible for different environments
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export async function fetchCleanedCosts(): Promise<CostRecord[]> {
  try {
    const response = await axios.get(`${BASE_URL}/ml/cleaned-costs`);
    return response.data.data; // Extract the data array from the response
  } catch (error) {
    console.error("Failed to fetch cleaned cost data:", error);
    return [];
  }
}
