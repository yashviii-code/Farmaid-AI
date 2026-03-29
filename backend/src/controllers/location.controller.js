import { fail, ok } from "../utils/response.js";
import * as locationService from "../services/location.service.js";

export async function getCurrentLocationWeather(req, res) {
  try {
    const result = await locationService.getLocationWeather(req.body || {});
    return ok(res, { data: result });
  } catch (error) {
    return fail(
      res,
      error.message || "Failed to fetch current location weather",
      error.status || 500,
      error.details || null,
    );
  }
}
