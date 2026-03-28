import { apiClient } from "./client";

export async function detectDisease(fileBlob) {
  const formData = new FormData();
  formData.append("image", fileBlob, "image.jpg");

  const { data } = await apiClient.post("/api/detect-disease", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
}
