import { apiClient } from "./client";

export async function getMyProfile() {
  const { data } = await apiClient.get("/api/users/me");
  return data;
}

export async function updateMyProfile(payload) {
  const { data } = await apiClient.put("/api/users/me", payload);
  return data;
}
