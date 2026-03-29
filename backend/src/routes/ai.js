import express from "express";
import multer from "multer";
import { detectDisease, predict } from "../controllers/ai.controller.js";
import { validateCropPrediction } from "../middleware/validateCropPrediction.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

export const aiRouter = express.Router();

aiRouter.post("/predict", validateCropPrediction, predict);
aiRouter.post("/crop/predict", validateCropPrediction, predict);
aiRouter.post("/disease/predict", upload.single("image"), detectDisease);
aiRouter.post("/detect-disease", upload.single("image"), detectDisease);
