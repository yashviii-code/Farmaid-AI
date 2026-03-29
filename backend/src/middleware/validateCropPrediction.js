import { validateCropPredictionPayload } from "../utils/cropPredictionValidation.js";

export function validateCropPrediction(req, res, next) {
  const { isValid, errors, sanitized } = validateCropPredictionPayload(req.body);

  if (!isValid) {
    return res.status(400).json({
      success: false,
      error: "Invalid input values",
      details: errors,
    });
  }

  req.body = sanitized;
  return next();
}
