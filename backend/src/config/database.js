import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { User } from "../models/User.js";

let mongoEnabled = false;

export function isMongoReady() {
  return mongoEnabled && mongoose.connection.readyState === 1;
}

export async function connectDatabase() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn("MONGO_URI not set. Running with in-memory fallback store.");
    mongoEnabled = false;
    return;
  }

  mongoose.set("strictQuery", true);
  mongoose.set("bufferCommands", false);

  await mongoose.connect(uri, {
    dbName: process.env.MONGO_DB_NAME || undefined,
  });

  mongoEnabled = true;
  await seedAdminUser();
  console.log("MongoDB connected");
}

async function seedAdminUser() {
  const existing = await User.findOne({ email: "admin@farmaid.ai" });
  if (existing) {
    return;
  }

  const passwordHash = await bcrypt.hash("admin12345", 10);
  await User.create({
    fullName: "Admin User",
    email: "admin@farmaid.ai",
    passwordHash,
    role: "admin",
    phone: "+91 90000 00000",
    location: "Head Office",
    language: "english",
    theme: "dark",
  });
}
