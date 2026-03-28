import { apiClient } from "./client";
import { clearTokens, setTokens } from "./storage";

export async function registerFarmer(payload) {
  const { data } = await apiClient.post("/api/auth/register", payload);
  if (data?.accessToken || data?.refreshToken) {
    setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
  }
  return data;
}

export async function loginUser(payload) {
  const { data } = await apiClient.post("/api/auth/login", payload);
  if (data?.accessToken || data?.refreshToken) {
    setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
  }
  return data;
}

export async function logoutUser() {
  const { data } = await apiClient.post("/api/auth/logout", {
    refreshToken: localStorage.getItem("farmaidRefreshToken"),
  });
  clearTokens();
  return data;
}
