import { fail, ok } from "../utils/response.js";
import * as aiService from "../services/ai.service.js";

export async function predict(req, res) {
  const result = await aiService.createPrediction(req.body || {});
  return ok(res, result);
}

export async function detectDisease(req, res) {
  if (!req.file) {
    return fail(res, "image file is required", 400);
  }

  const result = await aiService.detectDiseaseFromImage(req.file);
  return ok(res, result);
}
