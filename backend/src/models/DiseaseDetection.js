import mongoose from "mongoose";

const diseaseDetectionSchema = new mongoose.Schema(
    {
        fileName: { type: String, default: "" },
        mimeType: { type: String, default: "" },
        size: { type: Number, default: 0 },
        disease: { type: String, default: "" },
        confidence: { type: Number, default: 0 },
        severity: { type: String, default: "Medium" },
        treatment: {
            pesticide: { type: String, default: "" },
            dosage: { type: String, default: "" },
            frequency: { type: String, default: "" },
        },
        prevention: [String],
    },
    { timestamps: true },
);

export const DiseaseDetection =
    mongoose.models.DiseaseDetection || mongoose.model("DiseaseDetection", diseaseDetectionSchema);
