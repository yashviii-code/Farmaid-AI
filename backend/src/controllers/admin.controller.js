import { fail, ok } from "../utils/response.js";
import * as adminService from "../services/admin.service.js";

export async function listFarmers(req, res) {
  const result = await adminService.listFarmers(req.query || {});
  return ok(res, result);
}

export async function getFarmer(req, res) {
  const farmer = await adminService.getFarmerById(req.params.id);
  if (!farmer) {
    return fail(res, "Farmer not found", 404);
  }

  return ok(res, { farmer });
}

export async function deleteFarmer(req, res) {
  const deleted = await adminService.deleteFarmerById(req.params.id, req.user.id);
  if (!deleted) {
    return fail(res, "Farmer not found", 404);
  }

  return ok(res, { message: "Farmer deleted" });
}

export async function listLogs(req, res) {
  const result = await adminService.listLogs(req.query || {});
  return ok(res, result);
}

export async function dashboard(req, res) {
  const result = await adminService.getDashboardData();
  return ok(res, result);
}

export async function getSettings(req, res) {
  const settings = await adminService.getAdminSettings();
  return ok(res, { settings });
}

export async function updateSettings(req, res) {
  const settings = await adminService.updateAdminSettings(req.body || {});
  return ok(res, { settings });
}
