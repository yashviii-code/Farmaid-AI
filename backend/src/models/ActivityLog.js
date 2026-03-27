import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
    {
        actionType: { type: String, required: true },
        details: { type: mongoose.Schema.Types.Mixed, default: {} },
    },
    { timestamps: true },
);

export const ActivityLog =
    mongoose.models.ActivityLog || mongoose.model("ActivityLog", activityLogSchema);
