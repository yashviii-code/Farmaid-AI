import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { getMySettings, updateMySettings } from "../controllers/settings.controller.js";

export const settingsRouter = express.Router();

settingsRouter.use(requireAuth);

settingsRouter.get("/me", getMySettings);
settingsRouter.put("/me", updateMySettings);
