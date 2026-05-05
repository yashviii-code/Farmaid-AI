import { v4 as uuid } from "uuid";
import { isMongoReady } from "../config/database.js";
import { db } from "../data/store.js";
import { ActivityLog } from "../models/ActivityLog.js";
import { AdminSettings } from "../models/AdminSettings.js";
import { CropPrediction } from "../models/CropPrediction.js";
import { DiseaseDetection } from "../models/DiseaseDetection.js";
import { FarmerProfile } from "../models/FarmerProfile.js";
import { User } from "../models/User.js";

async function getFarmerRowsMongo() {
  const farmerUsers = await User.find({ role: "farmer" });
  const profiles = await FarmerProfile.find({
    userId: { $in: farmerUsers.map((u) => u._id) },
  });
  const profileByUser = new Map(profiles.map((p) => [String(p.userId), p]));

  return farmerUsers.map((user) => {
    const profile = profileByUser.get(String(user._id));
    return {
      id: String(user._id),
      name: profile?.name || user.fullName,
      email: user.email,
      phone: profile?.phone || "",
      location: profile?.location || "",
      farmSize: profile?.totalArea || "",
      crops: profile?.mainCrops || "",
      joinedDate: user.createdAt,
    };
  });
}

function getFarmerRowsMemory() {
  const farmerUsers = db.users.filter((u) => u.role === "farmer");
  return farmerUsers.map((user) => {
    const profile = db.farmerProfiles.find((p) => p.userId === user.id);
    return {
      id: user.id,
      name: profile?.name || user.fullName,
      email: user.email,
      phone: profile?.phone || "",
      location: profile?.location || "",
      farmSize: profile?.totalArea || "",
      crops: profile?.mainCrops || "",
      joinedDate: user.createdAt,
    };
  });
}

export async function listFarmers({ search = "", page = 1, limit = 10 }) {
  const rows = (isMongoReady() ? await getFarmerRowsMongo() : getFarmerRowsMemory()).filter((row) => {
    const term = String(search).toLowerCase();
    return !term || row.name.toLowerCase().includes(term) || row.location.toLowerCase().includes(term);
  });

  const p = Number(page);
  const l = Number(limit);
  const start = (p - 1) * l;
  return {
    farmers: rows.slice(start, start + l),
    total: rows.length,
    pagination: {
      page: p,
      limit: l,
      totalPages: Math.max(1, Math.ceil(rows.length / l)),
    },
  };
}

export async function getFarmerById(id) {
  const rows = isMongoReady() ? await getFarmerRowsMongo() : getFarmerRowsMemory();
  return rows.find((entry) => entry.id === id) || null;
}

export async function deleteFarmerById(id, deletedBy) {
  if (isMongoReady()) {
    const user = await User.findOne({ _id: id, role: "farmer" });
    if (!user) {
      return false;
    }

    await FarmerProfile.deleteOne({ userId: user._id });
    await User.deleteOne({ _id: user._id });
    await ActivityLog.create({
      actionType: "farmer_deleted",
      details: { farmerId: id, by: deletedBy },
    });
    return true;
  }

  const user = db.users.find((entry) => entry.id === id && entry.role === "farmer");
  if (!user) {
    return false;
  }

  db.users = db.users.filter((entry) => entry.id !== user.id);
  db.farmerProfiles = db.farmerProfiles.filter((entry) => entry.userId !== user.id);
  db.activityLogs.push({
    id: uuid(),
    actionType: "farmer_deleted",
    details: { farmerId: user.id, by: deletedBy },
    createdAt: new Date().toISOString(),
  });
  return true;
}

export async function listLogs({ page = 1, limit = 20 }) {
  const p = Number(page);
  const l = Number(limit);
  const start = (p - 1) * l;

  if (isMongoReady()) {
    const total = await ActivityLog.countDocuments();
    const logs = await ActivityLog.find().sort({ createdAt: -1 }).skip(start).limit(l).lean();
    return {
      logs,
      total,
      pagination: {
        page: p,
        limit: l,
        totalPages: Math.max(1, Math.ceil(total / l)),
      },
    };
  }

  return {
    logs: db.activityLogs.slice(start, start + l),
    total: db.activityLogs.length,
    pagination: {
      page: p,
      limit: l,
      totalPages: Math.max(1, Math.ceil(db.activityLogs.length / l)),
    },
  };
}

export async function getDashboardData() {
  if (isMongoReady()) {
    const totalFarmers = await User.countDocuments({ role: "farmer" });
    const totalRecommendations = await CropPrediction.countDocuments();
    const totalDetections = await DiseaseDetection.countDocuments();
    return {
      metrics: { totalFarmers, totalRecommendations, totalDetections },
      trends: {
        recommendationsLast7Days: [2, 4, 3, 6, 8, 5, 7],
        detectionsLast7Days: [1, 1, 2, 3, 2, 4, 2],
      },
    };
  }

  return {
    metrics: {
      totalFarmers: db.users.filter((u) => u.role === "farmer").length,
      totalRecommendations: db.cropPredictions.length,
      totalDetections: db.diseaseDetections.length,
    },
    trends: {
      recommendationsLast7Days: [2, 4, 3, 6, 8, 5, 7],
      detectionsLast7Days: [1, 1, 2, 3, 2, 4, 2],
    },
  };
}

export async function getAdminSettings() {
  if (isMongoReady()) {
    let settings = await AdminSettings.findOne();
    if (!settings) {
      settings = await AdminSettings.create({});
    }
    return settings.toObject();
  }

  return db.adminSettings;
}

export async function updateAdminSettings(payload) {
  if (isMongoReady()) {
    let settings = await AdminSettings.findOne();
    if (!settings) {
      settings = await AdminSettings.create(payload);
      return settings.toObject();
    }

    Object.assign(settings, payload);
    await settings.save();
    return settings.toObject();
  }

  db.adminSettings = {
    ...db.adminSettings,
    ...payload,
    updatedAt: new Date().toISOString(),
  };
  return db.adminSettings;
}
