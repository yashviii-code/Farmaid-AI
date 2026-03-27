import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        passwordHash: { type: String, required: true },
        role: { type: String, enum: ["farmer", "admin"], default: "farmer" },
        phone: { type: String, default: "" },
        location: { type: String, default: "" },
        language: { type: String, default: "english" },
        theme: { type: String, default: "dark" },
    },
    { timestamps: true },
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
