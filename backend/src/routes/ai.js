import express from "express";
import multer from "multer";
import { detectDisease, predict } from "../controllers/ai.controller.js";
import { optionalAuth } from "../middleware/auth.js";
import { validateCropPrediction } from "../middleware/validateCropPrediction.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

export const aiRouter = express.Router();

aiRouter.post("/predict", optionalAuth, validateCropPrediction, predict);
aiRouter.post("/crop/predict", optionalAuth, validateCropPrediction, predict);
aiRouter.post("/disease/predict", optionalAuth, upload.single("image"), detectDisease);
aiRouter.post("/detect-disease", optionalAuth, upload.single("image"), detectDisease);
