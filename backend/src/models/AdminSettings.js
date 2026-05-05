import mongoose from "mongoose";

const adminSettingsSchema = new mongoose.Schema(
    {
        notifications: {
            emailNotifications: { type: Boolean, default: true },
            pushNotifications: { type: Boolean, default: false },
            digestFrequency: { type: String, default: "daily" },
        },
        security: {
            twoFactorEnabled: { type: Boolean, default: false },
            autoBackupEnabled: { type: Boolean, default: true },
        },
        system: {
            theme: { type: String, default: "dark" },
            language: { type: String, default: "english" },
            timezone: { type: String, default: "Asia/Kolkata" },
        },
        data: {
            dataRetentionDays: { type: Number, default: 90 },
            apiRateLimit: { type: Number, default: 100 },
        },
    },
    { timestamps: true },
);

export const AdminSettings =
    mongoose.models.AdminSettings || mongoose.model("AdminSettings", adminSettingsSchema);
