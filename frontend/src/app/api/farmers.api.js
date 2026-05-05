import { apiClient } from "./client";

export async function getFarmers(params = {}) {
  const { data } = await apiClient.get("/api/farmers", { params });
  return {
    farmers: data?.farmers || [],
    filters: data?.filters || { locations: [] },
    total: data?.total || 0,
    pagination: data?.pagination || { page: 1, limit: 10, totalPages: 1 },
  };
}

export async function getFarmerStats() {
  const { data } = await apiClient.get("/api/farmers/stats");
  return data?.stats || {};
}

export async function getFarmerById(id) {
  const { data } = await apiClient.get(`/api/farmers/${id}`);
  return data?.farmer || null;
}

export async function deleteFarmerById(id) {
  const { data } = await apiClient.delete(`/api/farmers/${id}`);
  return data;
}
