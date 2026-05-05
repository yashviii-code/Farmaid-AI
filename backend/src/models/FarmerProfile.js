import mongoose from "mongoose";

const farmerProfileSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
        name: { type: String, default: "" },
        email: { type: String, default: "" },
        phone: { type: String, default: "" },
        location: { type: String, default: "" },
        totalArea: { type: String, default: "" },
        soilType: { type: String, default: "" },
        irrigationMethod: { type: String, default: "" },
        mainCrops: { type: String, default: "" },
        profileImage: { type: String, default: "" },
    },
    { timestamps: true },
);

export const FarmerProfile =
    mongoose.models.FarmerProfile || mongoose.model("FarmerProfile", farmerProfileSchema);
