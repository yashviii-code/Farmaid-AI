import { fail, ok } from "../utils/response.js";
import * as authService from "../services/auth.service.js";

export async function register(req, res) {
  const { fullName, email, password } = req.body || {};
  if (!fullName || !email || !password) {
    return fail(res, "fullName, email, and password are required", 400);
  }

  const result = await authService.registerUser({ fullName, email, password });
  if (result.error) {
    return fail(res, result.error, result.status || 400);
  }

  return ok(
    res,
    {
      message: "Registration successful",
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    },
    201,
  );
}

export async function login(req, res) {
  const { email, password, role } = req.body || {};
  if (!email || !password) {
    return fail(res, "email and password are required", 400);
  }

  const result = await authService.loginUser({ email, password, role });
  if (result.error) {
    return fail(res, result.error, result.status || 400);
  }

  return ok(res, {
    user: result.user,
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  });
}

export async function refreshToken(req, res) {
  const result = await authService.refreshAccessToken(req.body?.refreshToken);
  if (result.error) {
    return fail(res, result.error, result.status || 400);
  }

  return ok(res, { accessToken: result.accessToken });
}

export async function logout(req, res) {
  await authService.logoutUser(req.body?.refreshToken);
  return ok(res, { message: "Logged out" });
}
