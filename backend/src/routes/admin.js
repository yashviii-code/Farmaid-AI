import express from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import {
  dashboard,
  deleteFarmer,
  getFarmer,
  getSettings,
  listFarmers,
  listLogs,
  updateSettings,
} from "../controllers/admin.controller.js";

export const adminRouter = express.Router();

adminRouter.use(requireAuth, requireRole("admin"));

adminRouter.get("/farmers", listFarmers);
adminRouter.get("/farmers/:id", getFarmer);
adminRouter.delete("/farmers/:id", deleteFarmer);
adminRouter.get("/logs", listLogs);
adminRouter.get("/dashboard", dashboard);
adminRouter.get("/settings", getSettings);
adminRouter.put("/settings", updateSettings);
