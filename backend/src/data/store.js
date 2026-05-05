import { v4 as uuid } from "uuid";
import bcrypt from "bcryptjs";

const now = new Date().toISOString();

const adminPasswordHash = bcrypt.hashSync("admin12345", 10);

export const db = {
  users: [
    {
      id: uuid(),
      fullName: "Admin User",
      email: "admin@farmaid.ai",
      passwordHash: adminPasswordHash,
      role: "admin",
      phone: "+91 90000 00000",
      location: "Head Office",
      language: "english",
      theme: "dark",
      createdAt: now,
      updatedAt: now,
    },
  ],
  farmerProfiles: [],
  refreshTokens: [],
  cropPredictions: [],
  diseaseDetections: [],
  activityLogs: [],
  userSettings: [],
  adminSettings: {
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      digestFrequency: "daily",
    },
    security: {
      twoFactorEnabled: false,
      autoBackupEnabled: true,
    },
    system: {
      theme: "dark",
      language: "english",
      timezone: "Asia/Kolkata",
    },
    data: {
      dataRetentionDays: 90,
      apiRateLimit: 100,
    },
    updatedAt: now,
  },
};

export function seedFarmer(user) {
  const profile = {
    userId: user.id,
    name: user.fullName,
    email: user.email,
    phone: "+91 98765 43210",
    location: "Punjab, India",
    totalArea: "45 Acres",
    soilType: "Alluvial Soil",
    irrigationMethod: "Drip & Sprinkler",
    mainCrops: "Wheat, Rice, Cotton",
    profileImage: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.farmerProfiles.push(profile);
  db.userSettings.push({
    userId: user.id,
    notifications: true,
    twoFactor: false,
    automaticBackups: true,
    cacheSize: "256 MB",
    language: user.language,
    theme: user.theme,
    updatedAt: new Date().toISOString(),
  });

  return profile;
}
