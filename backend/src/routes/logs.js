import express from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { fetchLogs, fetchLogsStats } from "../controllers/logs.controller.js";

export const logsRouter = express.Router();

logsRouter.use(requireAuth, requireRole("admin"));

logsRouter.get("/", fetchLogs);
logsRouter.get("/stats", fetchLogsStats);
