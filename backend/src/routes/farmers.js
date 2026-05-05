import express from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import {
  deleteFarmer,
  getFarmer,
  getFarmerStats,
  listFarmers,
} from "../controllers/farmers.controller.js";

export const farmersRouter = express.Router();

farmersRouter.use(requireAuth, requireRole("admin"));

farmersRouter.get("/", listFarmers);
farmersRouter.get("/stats", getFarmerStats);
farmersRouter.get("/:id", getFarmer);
farmersRouter.delete("/:id", deleteFarmer);
