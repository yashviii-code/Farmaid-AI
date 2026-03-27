import { v4 as uuid } from "uuid";
import { isMongoReady } from "../config/database.js";
import { db } from "../data/store.js";
import { CropPrediction } from "../models/CropPrediction.js";
import { DiseaseDetection } from "../models/DiseaseDetection.js";

function rankCrops(input) {
    const rules = [
        { crop: "Rice", score: (input.N * 0.25) + (input.rainfall * 0.2) + (input.humidity * 0.2) },
        { crop: "Wheat", score: (input.P * 0.25) + ((35 - input.temperature) * 1.5) + ((1000 - input.rainfall) * 0.05) },
        { crop: "Cotton", score: (input.K * 0.25) + (input.temperature * 2) + (input.ph * 10) },
        { crop: "Maize", score: (input.N * 0.2) + (input.P * 0.2) + (input.temperature * 1.5) },
        { crop: "Sugarcane", score: (input.rainfall * 0.25) + (input.humidity * 0.3) + (input.K * 0.1) },
    ];

    return rules
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map((entry, index) => ({ crop: entry.crop, match: Math.max(55, 90 - (index * 8)) }));
}

export async function createPrediction(payload) {
    const input = {
        N: Number(payload.N || 0),
        P: Number(payload.P || 0),
        K: Number(payload.K || 0),
        temperature: Number(payload.temperature || 0),
        humidity: Number(payload.humidity || 0),
        ph: Number(payload.ph || 0),
        rainfall: Number(payload.rainfall || 0),
    };

    const recommendations = rankCrops(input);
    const explanation = "Recommendation generated from current NPK and weather pattern inputs.";

    if (isMongoReady()) {
        await CropPrediction.create({ input, recommendations, explanation });
    } else {
        db.cropPredictions.push({
            id: uuid(),
            input,
            recommendations,
            explanation,
            createdAt: new Date().toISOString(),
        });
    }

    return { recommendations, explanation };
}

export async function detectDiseaseFromImage(file) {
    const result = {
        disease: "Leaf Blight",
        confidence: 0.91,
        severity: "Medium",
        treatment: {
            pesticide: "Copper Oxychloride",
            dosage: "2g per liter of water",
            frequency: "Apply every 7 days for 3 cycles",
        },
        prevention: [
            "Remove infected leaves early",
            "Avoid overhead irrigation in late evening",
            "Use disease-resistant varieties when possible",
        ],
    };

    if (isMongoReady()) {
        await DiseaseDetection.create({
            fileName: file?.originalname || "image.jpg",
            mimeType: file?.mimetype || "image/jpeg",
            size: file?.size || 0,
            ...result,
        });
    } else {
        db.diseaseDetections.push({
            id: uuid(),
            fileName: file?.originalname || "image.jpg",
            mimeType: file?.mimetype || "image/jpeg",
            size: file?.size || 0,
            ...result,
            createdAt: new Date().toISOString(),
        });
    }

    return result;
}
