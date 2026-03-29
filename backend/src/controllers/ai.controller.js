import { fail, ok } from "../utils/response.js";
import * as aiService from "../services/ai.service.js";

export async function predict(req, res) {
  try {
    const result = await aiService.createPrediction(req.body || {});
    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return fail(res, error.message || "Prediction failed", error.status || 500);
  }
}

export async function detectDisease(req, res) {
  if (!req.file) {
    return fail(res, "image file is required", 400);
  }

  try {
    const result = await aiService.detectDiseaseFromImage(req.file);
    return ok(res, { data: result });
  } catch (error) {
    return fail(
      res,
      error.message || "Disease detection failed",
      error.status || 500,
      error.details || null,
    );
  }
}
