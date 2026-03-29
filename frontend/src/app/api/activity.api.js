import { apiClient } from "./client";

export async function getRecentActivities(limit = 10) {
  const { data } = await apiClient.get("/api/activity", {
    params: { limit },
  });

  return Array.isArray(data) ? data : [];
}
