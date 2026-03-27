import { fail } from "../utils/response.js";
import { verifyAccessToken } from "../utils/tokens.js";
import { getUserById } from "../services/users.service.js";

export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return fail(res, "Unauthorized", 401);
  }

  try {
    const decoded = verifyAccessToken(token);
    const user = await getUserById(decoded.sub);
    if (!user) {
      return fail(res, "Unauthorized", 401);
    }
    req.user = user;
    next();
  } catch {
    return fail(res, "Unauthorized", 401);
  }
}

export function requireRole(role) {
  return function roleGuard(req, res, next) {
    if (!req.user || req.user.role !== role) {
      return fail(res, "Forbidden", 403);
    }
    next();
  };
}
