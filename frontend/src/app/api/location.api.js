import { apiClient } from "./client";

export async function getCurrentLocationWeather(payload) {
  const { data } = await apiClient.post("/api/location/weather", payload);
  return data;
}
