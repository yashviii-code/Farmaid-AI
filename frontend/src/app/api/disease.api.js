import { apiClient } from "./client";

export async function detectDisease(file) {
  const formData = new FormData();
  formData.append("image", file);

  const { data } = await apiClient.post("/api/disease/predict", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
}
