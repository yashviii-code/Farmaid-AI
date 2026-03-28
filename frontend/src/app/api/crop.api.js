import { apiClient } from "./client";

export async function getCropRecommendations(payload) {
  const { data } = await apiClient.post("/api/predict", payload);
  return data;
}
