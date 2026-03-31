import { fail, ok } from "../utils/response.js";
import * as farmersService from "../services/farmers.service.js";

export async function listFarmers(req, res) {
  try {
    const result = await farmersService.listFarmers(req.query || {});
    return ok(res, result);
  } catch (error) {
    return fail(res, error.message || "Failed to fetch farmers", 500);
  }
}

export async function getFarmerStats(req, res) {
  try {
    const stats = await farmersService.getFarmerStats();
    return ok(res, { stats });
  } catch (error) {
    return fail(res, error.message || "Failed to fetch farmer stats", 500);
  }
}

export async function getFarmer(req, res) {
  try {
    const farmer = await farmersService.getFarmerById(req.params.id);
    if (!farmer) {
      return fail(res, "Farmer not found", 404);
    }

    return ok(res, { farmer });
  } catch (error) {
    return fail(res, error.message || "Failed to fetch farmer", 500);
  }
}

export async function deleteFarmer(req, res) {
  try {
    const deleted = await farmersService.deleteFarmerById(req.params.id, req.user?.id);
    if (!deleted) {
      return fail(res, "Farmer not found", 404);
    }

    return ok(res, { message: "Farmer deleted" });
  } catch (error) {
    return fail(res, error.message || "Failed to delete farmer", 500);
  }
}
