import { apiClient } from "./client";

/**
 * Fetch logs with optional type filter and pagination.
 * @param {{ type?: string, page?: number, limit?: number }} params
 */
export async function fetchLogs({ type, page = 1, limit = 20 } = {}) {
  const params = { page, limit };
  if (type && type !== "all") {
    params.type = type;
  }

  const { data } = await apiClient.get("/api/logs", { params });
  return {
    logs: data?.logs || [],
    total: data?.total || 0,
    pagination: data?.pagination || { page: 1, limit: 20, totalPages: 1 },
  };
}

/**
 * Fetch log stats for the admin dashboard.
 */
export async function fetchLogsStats() {
  const { data } = await apiClient.get("/api/logs/stats");
  return data?.stats || {
    totalActivities: 0,
    todayLogs: 0,
    activeUsers: 0,
    avgResponseTime: "—",
  };
}
