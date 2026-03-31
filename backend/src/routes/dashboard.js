import express from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import {
  getAnalytics,
  getCropDistribution,
  getStats,
} from "../controllers/dashboard.controller.js";

export const dashboardRouter = express.Router();

dashboardRouter.use(requireAuth, requireRole("admin"));

dashboardRouter.get("/stats", getStats);
dashboardRouter.get("/analytics", getAnalytics);
dashboardRouter.get("/crops", getCropDistribution);
