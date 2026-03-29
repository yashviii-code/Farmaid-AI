import axios from "axios";
import https from "https";
import { LOCATION_OPTIONS } from "../utils/cropPredictionValidation.js";

const INDIA_BOUNDS = {
  minLatitude: 6,
  maxLatitude: 38,
  minLongitude: 68,
  maxLongitude: 98,
};

const STATE_NORMALIZATION_MAP = {
  Orissa: "Odisha",
  Uttaranchal: "Uttarakhand",
};

const NETWORK_ERROR_CODES = new Set([
  "ECONNRESET",
  "ECONNABORTED",
  "ENOTFOUND",
  "EAI_AGAIN",
  "ETIMEDOUT",
  "ECONNREFUSED",
]);

const httpsAgent = new https.Agent({
  keepAlive: true,
  family: 4,
});

function isWithinIndiaBounds(latitude, longitude) {
  return (
    latitude >= INDIA_BOUNDS.minLatitude &&
    latitude <= INDIA_BOUNDS.maxLatitude &&
    longitude >= INDIA_BOUNDS.minLongitude &&
    longitude <= INDIA_BOUNDS.maxLongitude
  );
}

function normalizeStateName(rawState) {
  const trimmedState = String(rawState || "").trim();
  return STATE_NORMALIZATION_MAP[trimmedState] || trimmedState;
}

function inferIndianSeason() {
  const monthNumber = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kolkata",
      month: "numeric",
    }).format(new Date()),
  );

  if (monthNumber >= 6 && monthNumber <= 10) {
    return "Kharif";
  }

  if (monthNumber >= 11 || monthNumber <= 3) {
    return "Rabi";
  }

  return "Zaid";
}

async function reverseGeocodeIndiaLocation(latitude, longitude) {
  let data;
  try {
    const response = await axios.get("https://nominatim.openstreetmap.org/reverse", {
      timeout: 15000,
      httpsAgent,
      headers: {
        "User-Agent": "farmaid-ai/1.0",
      },
      params: {
        format: "jsonv2",
        lat: latitude,
        lon: longitude,
        zoom: 5,
        addressdetails: 1,
        "accept-language": "en",
      },
    });
    data = response.data;
  } catch (error) {
    throw wrapExternalApiError(error, "location lookup");
  }

  const countryCode = String(data?.address?.country_code || "").toUpperCase();
  if (countryCode !== "IN") {
    const error = new Error("Only India locations are supported");
    error.status = 400;
    throw error;
  }

  const stateName = normalizeStateName(data?.address?.state);
  if (!LOCATION_OPTIONS.includes(stateName)) {
    const error = new Error("Detected location is in India but outside the supported state list");
    error.status = 400;
    throw error;
  }

  return {
    state: stateName,
    district: String(data?.address?.state_district || data?.address?.county || "").trim(),
  };
}

async function fetchCurrentWeather(latitude, longitude) {
  let data;
  try {
    const response = await axios.get("https://api.open-meteo.com/v1/forecast", {
      timeout: 15000,
      httpsAgent,
      params: {
        latitude,
        longitude,
        timezone: "Asia/Kolkata",
        current: "temperature_2m,relative_humidity_2m,rain",
        daily: "precipitation_sum",
        forecast_days: 1,
      },
    });
    data = response.data;
  } catch (error) {
    throw wrapExternalApiError(error, "weather service");
  }

  return {
    temperature: Number(data?.current?.temperature_2m ?? 0),
    humidity: Number(data?.current?.relative_humidity_2m ?? 0),
    rainfall: Number(data?.daily?.precipitation_sum?.[0] ?? data?.current?.rain ?? 0),
  };
}

function wrapExternalApiError(error, providerName) {
  if (error.response) {
    const wrappedError = new Error(`Failed to fetch ${providerName}`);
    wrappedError.status = 502;
    wrappedError.details = {
      provider: providerName,
      status: error.response.status,
    };
    return wrappedError;
  }

  if (NETWORK_ERROR_CODES.has(error.code) || /TLS connection/i.test(error.message || "")) {
    const wrappedError = new Error(
      `Unable to connect to the ${providerName}. Check internet access, firewall, proxy, or TLS inspection settings.`,
    );
    wrappedError.status = 502;
    wrappedError.details = {
      provider: providerName,
      code: error.code || "NETWORK_ERROR",
    };
    return wrappedError;
  }

  const wrappedError = new Error(error.message || `Failed to fetch ${providerName}`);
  wrappedError.status = 500;
  wrappedError.details = {
    provider: providerName,
    code: error.code || "UNKNOWN_ERROR",
  };
  return wrappedError;
}

export async function getLocationWeather({ latitude, longitude }) {
  const parsedLatitude = Number(latitude);
  const parsedLongitude = Number(longitude);

  if (!Number.isFinite(parsedLatitude) || !Number.isFinite(parsedLongitude)) {
    const error = new Error("Latitude and longitude must be numeric values");
    error.status = 400;
    throw error;
  }

  if (!isWithinIndiaBounds(parsedLatitude, parsedLongitude)) {
    const error = new Error("Only India locations are supported");
    error.status = 400;
    throw error;
  }

  const location = await reverseGeocodeIndiaLocation(parsedLatitude, parsedLongitude);
  const weather = await fetchCurrentWeather(parsedLatitude, parsedLongitude);

  return {
    location: location.state,
    district: location.district,
    season: inferIndianSeason(),
    temperature: Math.round(weather.temperature * 10) / 10,
    humidity: Math.round(weather.humidity),
    rainfall: Math.round(weather.rainfall * 10) / 10,
  };
}
