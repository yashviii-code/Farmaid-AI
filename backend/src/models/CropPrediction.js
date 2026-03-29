import mongoose from "mongoose";

const cropPredictionSchema = new mongoose.Schema(
    {
        input: {
            N: Number,
            P: Number,
            K: Number,
            temperature: Number,
            humidity: Number,
            ph: Number,
            rainfall: Number,
            location: String,
            season: String,
            soil: String,
        },
        recommendations: [
            {
                crop: String,
                confidence: Number,
            },
        ],
        explanation: String,
    },
    { timestamps: true },
);

export const CropPrediction =
    mongoose.models.CropPrediction || mongoose.model("CropPrediction", cropPredictionSchema);
