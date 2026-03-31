import { fail, ok } from "../utils/response.js";
import {
  getDashboardAnalytics,
  getDashboardCropDistribution,
  getDashboardStats,
} from "../services/dashboard.service.js";

export async function getStats(req, res) {
  try {
    const stats = await getDashboardStats();
    return ok(res, { stats });
  } catch (error) {
    return fail(res, error.message || "Failed to fetch dashboard stats", 500);
  }
}

export async function getAnalytics(req, res) {
  try {
    const analytics = await getDashboardAnalytics();
    return ok(res, analytics);
  } catch (error) {
    return fail(res, error.message || "Failed to fetch dashboard analytics", 500);
  }
}

export async function getCropDistribution(req, res) {
  try {
    const crops = await getDashboardCropDistribution();
    return ok(res, { crops });
  } catch (error) {
    return fail(res, error.message || "Failed to fetch crop distribution", 500);
  }
}
