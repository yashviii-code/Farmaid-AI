import { fail } from "../utils/response.js";
import { getRecentActivities, getRecentActivitiesForAdmin } from "../services/activity.service.js";

export async function getMyRecentActivities(req, res) {
  try {
    const limit = req.query.limit ?? 10;
    const activities = await getRecentActivities(req.user.id, limit);
    return res.json(activities);
  } catch (error) {
    return fail(res, error.message || "Failed to fetch activities", 500);
  }
}

export async function getRecentAdminActivities(req, res) {
  try {
    const limit = req.query.limit ?? 10;
    const activities = await getRecentActivitiesForAdmin(limit);
    return res.json(activities);
  } catch (error) {
    return fail(res, error.message || "Failed to fetch recent activities", 500);
  }
}
