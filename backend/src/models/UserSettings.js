import mongoose from "mongoose";

const userSettingsSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
        notifications: { type: Boolean, default: true },
        twoFactor: { type: Boolean, default: false },
        automaticBackups: { type: Boolean, default: true },
        cacheSize: { type: String, default: "256 MB" },
        language: { type: String, default: "english" },
        theme: { type: String, default: "dark" },
    },
    { timestamps: true },
);

export const UserSettings =
    mongoose.models.UserSettings || mongoose.model("UserSettings", userSettingsSchema);
