import express from "express";
import { getMyRecentActivities } from "../controllers/activity.controller.js";
import { requireAuth } from "../middleware/auth.js";

export const activityRouter = express.Router();

activityRouter.get("/", requireAuth, getMyRecentActivities);
