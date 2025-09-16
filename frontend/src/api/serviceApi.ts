import axios from "axios";

const RAW_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
const BASE_URL = `${RAW_BASE.replace(/\/+$/, "")}`.endsWith("/api")
  ? `${RAW_BASE.replace(/\/+$/, "")}`
  : `${RAW_BASE.replace(/\/+$/, "")}/api`;

export async function fetchServices(): Promise<string[]> {
  try {
    const res = await axios.get<{ services: string[] }>(
      `${BASE_URL}/forecast/services`
    );
    return res.data.services;
  } catch (error) {
    console.error("Failed to fetch services:", error);
    return [];
  }
}
