export const LOCATION_OPTIONS = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

export const SEASON_OPTIONS = ["Kharif", "Rabi", "Zaid"];
export const SOIL_OPTIONS = ["Loamy", "Clay", "Sandy"];

export const NUMERIC_FIELD_RULES = {
  N: { min: 0, max: 140, label: "Nitrogen (N)" },
  P: { min: 5, max: 145, label: "Phosphorus (P)" },
  K: { min: 5, max: 205, label: "Potassium (K)" },
  temperature: { min: 0, max: 50, label: "Temperature" },
  humidity: { min: 0, max: 100, label: "Humidity" },
  ph: { min: 0, max: 14, label: "pH" },
  rainfall: { min: 0, max: 500, label: "Rainfall" },
};

function buildRangeMessage(field) {
  const rule = NUMERIC_FIELD_RULES[field];
  if (field === "temperature") {
    return `${rule.label} must be between ${rule.min} and ${rule.max}C`;
  }
  return `${rule.label} must be between ${rule.min} and ${rule.max}`;
}

export function validateCropPredictionPayload(payload) {
  const errors = {};
  const sanitized = {};

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return {
      isValid: false,
      errors: { body: "Request body must be a JSON object" },
      sanitized: null,
    };
  }

  for (const [field, rule] of Object.entries(NUMERIC_FIELD_RULES)) {
    const rawValue = payload[field];
    if (rawValue === undefined || rawValue === null || String(rawValue).trim() === "") {
      errors[field] = `${rule.label} is required`;
      continue;
    }

    const numericValue = Number(rawValue);
    if (!Number.isFinite(numericValue)) {
      errors[field] = `${rule.label} must be a numeric value`;
      continue;
    }

    if (numericValue < rule.min || numericValue > rule.max) {
      errors[field] = buildRangeMessage(field);
      continue;
    }

    sanitized[field] = numericValue;
  }

  const location = String(payload.location || "").trim();
  const season = String(payload.season || "").trim();
  const soil = String(payload.soil || "").trim();

  if (!location) {
    errors.location = "Location is required";
  } else if (!LOCATION_OPTIONS.includes(location)) {
    errors.location = "Invalid location";
  } else {
    sanitized.location = location;
  }

  if (!season) {
    errors.season = "Season is required";
  } else if (!SEASON_OPTIONS.includes(season)) {
    errors.season = "Invalid season";
  } else {
    sanitized.season = season;
  }

  if (!soil) {
    errors.soil = "Soil type is required";
  } else if (!SOIL_OPTIONS.includes(soil)) {
    errors.soil = "Invalid soil type";
  } else {
    sanitized.soil = soil;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitized,
  };
}
