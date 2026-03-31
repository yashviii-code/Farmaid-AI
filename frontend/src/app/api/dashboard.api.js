import { apiClient } from "./client";

export async function getDashboardStats() {
  const { data } = await apiClient.get("/api/dashboard/stats");
  return data?.stats || {};
}

export async function getDashboardAnalytics() {
  const { data } = await apiClient.get("/api/dashboard/analytics");
  return {
    months: data?.months || [],
    cropData: data?.cropData || [],
    diseaseData: data?.diseaseData || [],
  };
}

export async function getDashboardCropDistribution() {
  const { data } = await apiClient.get("/api/dashboard/crops");
  return data?.crops || [];
}

export async function getAdminRecentActivities(limit = 5) {
  const { data } = await apiClient.get("/api/activity/recent", {
    params: { limit },
  });

  return Array.isArray(data) ? data : [];
}
