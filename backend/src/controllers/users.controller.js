import { fail, ok } from "../utils/response.js";
import * as usersService from "../services/users.service.js";

export async function getMe(req, res) {
  const profile = await usersService.getMyProfile(req.user);
  return ok(res, { profile });
}

export async function updateMe(req, res) {
  const profile = await usersService.updateMyProfile(req.user, req.body || {});
  if (!profile) {
    return fail(res, "Profile not found", 404);
  }

  return ok(res, { profile });
}
