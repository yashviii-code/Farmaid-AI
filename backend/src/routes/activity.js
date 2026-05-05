import express from "express";
import { getMyRecentActivities, getRecentAdminActivities } from "../controllers/activity.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

export const activityRouter = express.Router();

activityRouter.get("/", requireAuth, getMyRecentActivities);
activityRouter.get("/recent", requireAuth, requireRole("admin"), getRecentAdminActivities);
