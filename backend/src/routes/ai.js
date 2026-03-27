import express from "express";
import multer from "multer";
import { detectDisease, predict } from "../controllers/ai.controller.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

export const aiRouter = express.Router();

aiRouter.post("/predict", predict);
aiRouter.post("/detect-disease", upload.single("image"), detectDisease);
