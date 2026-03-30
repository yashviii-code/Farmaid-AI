import { fail } from "../utils/response.js";
import { createActivity } from "../services/activity.service.js";
import * as aiService from "../services/ai.service.js";

async function logActivity(userId, type, message) {
  if (!userId) {
    return;
  }

  try {
    await createActivity({
      userId,
      type,
      message,
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}

export async function predict(req, res) {
  try {
    const result = await aiService.createPrediction(req.body || {});
    const topCrop = result?.recommendations?.[0]?.crop;

    await logActivity(
      req.user?.id,
      "crop",
      topCrop ? `${topCrop} crop recommendation generated` : "Crop recommendation generated",
    );

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
    const flaskResponse = await aiService.detectDiseaseFromImage(req.file);

    await logActivity(
      req.user?.id,
      "disease",
      flaskResponse?.disease ? `Detected ${flaskResponse.disease}` : "Disease detected",
    );

    return res.json({
      success: true,
      data: flaskResponse,
    });
  } catch (error) {
    return fail(
      res,
      error.message || "Disease detection failed",
      error.status || 500,
      error.details || null,
    );
  }
}

export async function ocrPredictCrop(req, res) {
  if (!req.file) {
    return fail(res, "image file is required", 400);
  }

  try {
    const result = await aiService.createOcrPredictionFromImage(req.file, req.body || {});
    const topCrop = result?.recommendations?.[0]?.crop;

    if (topCrop) {
      await logActivity(
        req.user?.id,
        "crop",
        `${topCrop} crop recommendation generated from OCR report`,
      );
    }

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return fail(res, error.message || "OCR prediction failed", error.status || 500, error.details || null);
  }
}
