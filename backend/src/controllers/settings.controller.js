import { ok } from "../utils/response.js";
import * as settingsService from "../services/settings.service.js";

export async function getMySettings(req, res) {
  const settings = await settingsService.getMySettings(req.user);
  return ok(res, { settings });
}

export async function updateMySettings(req, res) {
  const settings = await settingsService.updateMySettings(req.user, req.body || {});
  return ok(res, { settings });
}
