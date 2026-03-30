import { apiClient } from "./client";

export async function getCropRecommendations(payload) {
  const { data } = await apiClient.post("/api/crop/predict", payload);
  return data;
}

export async function getCropRecommendationsFromOcr({ image, location, season, soil }) {
  const formData = new FormData();
  formData.append("image", image);

  if (location) {
    formData.append("location", location);
  }
  if (season) {
    formData.append("season", season);
  }
  if (soil) {
    formData.append("soil", soil);
  }

  const { data } = await apiClient.post("/api/crop/ocr", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
}
