import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      default: "",
      trim: true,
    },
    type: {
      type: String,
      enum: ["recommendation", "disease", "upload", "auth", "profile", "crop"],
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      default: "",
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

activitySchema.index({ type: 1, createdAt: -1 });
activitySchema.index({ createdAt: -1 });
activitySchema.index({ userId: 1, createdAt: -1 });

export const Activity =
  mongoose.models.Activity || mongoose.model("Activity", activitySchema);
