import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export async function fetchServices(): Promise<string[]> {
  try {
    const res = await axios.get<{ services: string[] }>(`${BASE_URL}/services`);
    return res.data.services;
  } catch (error) {
    console.error("Failed to fetch services:", error);
    return [];
  }
}
