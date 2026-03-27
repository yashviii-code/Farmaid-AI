import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
    {
        token: { type: String, required: true, unique: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true },
);

export const RefreshToken =
    mongoose.models.RefreshToken || mongoose.model("RefreshToken", refreshTokenSchema);
