/**
 * Seed script to populate the Activity collection with sample logs.
 *
 * Usage:  node scripts/seed-logs.js
 *
 * Requires MONGO_URI to be set in backend/.env
 */
import "dotenv/config";
import mongoose from "mongoose";
import { Activity } from "../src/models/activity.model.js";
import { User } from "../src/models/User.js";

const SAMPLE_ACTIVITIES = [
  { type: "recommendation", message: "Crop Recommendation Generated — Rice for Punjab region" },
  { type: "disease",        message: "Disease Detection Completed — Late Blight in Tomato" },
  { type: "upload",         message: "Soil Report Uploaded — Lab report processed via OCR" },
  { type: "auth",           message: "User Login — Successful login from mobile app" },
  { type: "recommendation", message: "Crop Recommendation Generated — Wheat for Rabi season" },
  { type: "disease",        message: "Disease Detection Completed — Powdery Mildew in Wheat" },
  { type: "profile",        message: "Profile Updated — Farm size and crop details modified" },
  { type: "recommendation", message: "Crop Recommendation Generated — Cotton recommendation" },
  { type: "auth",           message: "User Login — New device login detected" },
  { type: "upload",         message: "Crop Image Uploaded — Image processed for disease detection" },
  { type: "disease",        message: "Disease Detection Completed — Rust detected in Soybean" },
  { type: "profile",        message: "Profile Updated — Location changed to Maharashtra" },
  { type: "recommendation", message: "Crop Recommendation Generated — Sugarcane for Kharif season" },
  { type: "auth",           message: "User Logout — Session expired" },
  { type: "upload",         message: "Soil Report Uploaded — Nitrogen analysis results" },
  { type: "disease",        message: "Disease Detection Completed — Leaf Spot in Groundnut" },
  { type: "recommendation", message: "Crop Recommendation Generated — Bajra for semi-arid region" },
  { type: "profile",        message: "Profile Updated — Phone number changed" },
  { type: "auth",           message: "Password Reset — Successful password change" },
  { type: "upload",         message: "Field Photo Uploaded — Analyzed for crop health" },
];

const LOCATIONS = [
  "Punjab", "Maharashtra", "Gujarat", "Uttar Pradesh", "Haryana",
  "Karnataka", "Madhya Pradesh", "Telangana", "Rajasthan", "Tamil Nadu",
];

async function main() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI is not set in .env");
    process.exit(1);
  }

  await mongoose.connect(uri, {
    dbName: process.env.MONGO_DB_NAME || undefined,
  });
  console.log("Connected to MongoDB");

  // Find all users (to attach logs to real users)
  const users = await User.find().lean();
  if (users.length === 0) {
    console.error("No users found in the database. Please sign up or seed users first.");
    await mongoose.disconnect();
    process.exit(1);
  }

  console.log(`Found ${users.length} user(s). Seeding activity logs...`);

  const docs = [];
  const now = Date.now();

  for (let i = 0; i < SAMPLE_ACTIVITIES.length; i++) {
    const user = users[i % users.length];
    const sample = SAMPLE_ACTIVITIES[i];
    docs.push({
      userId: user._id,
      userName: user.fullName,
      type: sample.type,
      message: sample.message,
      location: user.location || LOCATIONS[i % LOCATIONS.length],
      createdAt: new Date(now - i * 300_000), // 5 minutes apart
    });
  }

  await Activity.insertMany(docs);
  console.log(`Seeded ${docs.length} activity logs successfully!`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
