import { v4 as uuid } from "uuid";
import { isMongoReady } from "../config/database.js";
import { db } from "../data/store.js";
import { Activity } from "../models/activity.model.js";
import { ActivityLog } from "../models/ActivityLog.js";
import { FarmerProfile } from "../models/FarmerProfile.js";
import { RefreshToken } from "../models/RefreshToken.js";
import { User } from "../models/User.js";
import { UserSettings } from "../models/UserSettings.js";
import { isVisibleFarmer, parseFarmArea } from "../utils/farmerFilters.js";

function normalizeCrops(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => String(entry).trim()).filter(Boolean);
  }

  return String(value || "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function buildFarmerRecord(user, profile, activityCounts = { recommendations: 0, detections: 0 }) {
  const crops = normalizeCrops(profile?.mainCrops);
  const farmSize = profile?.totalArea || "";

  return {
    id: String(user?._id || user?.id),
    userId: String(user?._id || user?.id),
    name: profile?.name || user?.fullName || "",
    email: profile?.email || user?.email || "",
    phone: profile?.phone || user?.phone || "",
    location: profile?.location || user?.location || "",
    farmSize,
    farmAreaValue: parseFarmArea(farmSize),
    crops,
    recommendations: Number(activityCounts.recommendations || 0),
    detections: Number(activityCounts.detections || 0),
    joinedDate: user?.createdAt,
    createdAt: user?.createdAt,
  };
}

function toFarmerDetail(record, recentActivity = []) {
  return {
    ...record,
    recentActivity,
  };
}

async function getMongoActivityCountsByUser() {
  const rows = await Activity.aggregate([
    {
      $match: {
        type: { $in: ["crop", "disease"] },
      },
    },
    {
      $group: {
        _id: {
          userId: "$userId",
          type: "$type",
        },
        count: { $sum: 1 },
      },
    },
  ]);

  const counts = new Map();
  for (const row of rows) {
    const userId = String(row._id.userId);
    const current = counts.get(userId) || { recommendations: 0, detections: 0 };
    if (row._id.type === "crop") {
      current.recommendations = row.count;
    }
    if (row._id.type === "disease") {
      current.detections = row.count;
    }
    counts.set(userId, current);
  }

  return counts;
}

function getMemoryActivityCountsByUser() {
  const counts = new Map();
  for (const entry of db.activityLogs) {
    const userId = String(entry.userId || "");
    if (!userId) {
      continue;
    }

    const current = counts.get(userId) || { recommendations: 0, detections: 0 };
    if (entry.type === "crop") {
      current.recommendations += 1;
    }
    if (entry.type === "disease") {
      current.detections += 1;
    }
    counts.set(userId, current);
  }

  return counts;
}

async function getMongoFarmerRows() {
  const farmerUsers = await User.find({ role: "farmer" })
    .select({ fullName: 1, email: 1, phone: 1, location: 1, createdAt: 1, role: 1 })
    .lean();
  const visibleFarmers = farmerUsers.filter(isVisibleFarmer);
  const profiles = await FarmerProfile.find({
    userId: { $in: visibleFarmers.map((user) => user._id) },
  }).lean();
  const profileByUserId = new Map(profiles.map((profile) => [String(profile.userId), profile]));
  const activityCountsByUser = await getMongoActivityCountsByUser();

  return visibleFarmers.map((user) =>
    buildFarmerRecord(user, profileByUserId.get(String(user._id)), activityCountsByUser.get(String(user._id))),
  );
}

function getMemoryFarmerRows() {
  const visibleFarmers = db.users.filter(isVisibleFarmer);
  const activityCountsByUser = getMemoryActivityCountsByUser();

  return visibleFarmers.map((user) => {
    const profile = db.farmerProfiles.find((entry) => String(entry.userId) === String(user.id));
    return buildFarmerRecord(user, profile, activityCountsByUser.get(String(user.id)));
  });
}

async function getMongoRecentFarmerActivity(userId) {
  const rows = await Activity.find({ userId, type: { $in: ["crop", "disease"] } })
    .sort({ createdAt: -1 })
    .limit(5)
    .select({ type: 1, message: 1, createdAt: 1, _id: 0 })
    .lean();

  return rows.map((entry) => ({
    type: entry.type,
    message: entry.message,
    createdAt: entry.createdAt,
  }));
}

function getMemoryRecentFarmerActivity(userId) {
  return db.activityLogs
    .filter((entry) => String(entry.userId) === String(userId) && ["crop", "disease"].includes(entry.type))
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
    .slice(0, 5)
    .map((entry) => ({
      type: entry.type,
      message: entry.message,
      createdAt: entry.createdAt,
    }));
}

async function getMongoActiveTodayUserIds() {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const userIds = await Activity.distinct("userId", {
    createdAt: { $gte: todayStart },
    type: { $in: ["crop", "disease"] },
  });

  return new Set(userIds.map((userId) => String(userId)));
}

function getMemoryActiveTodayUserIds() {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  return new Set(
    db.activityLogs
      .filter(
        (entry) =>
          new Date(entry.createdAt) >= todayStart && ["crop", "disease"].includes(entry.type),
      )
      .map((entry) => String(entry.userId)),
  );
}

export async function listFarmers({
  search = "",
  location = "",
  activity = "all",
  page = 1,
  limit = 10,
}) {
  const rows = isMongoReady() ? await getMongoFarmerRows() : getMemoryFarmerRows();
  const normalizedSearch = String(search).trim().toLowerCase();
  const normalizedLocation = String(location).trim().toLowerCase();
  const normalizedActivity = String(activity || "all").trim().toLowerCase();

  const filteredRows = rows.filter((row) => {
    const matchesSearch =
      !normalizedSearch ||
      row.name.toLowerCase().includes(normalizedSearch) ||
      row.location.toLowerCase().includes(normalizedSearch) ||
      row.email.toLowerCase().includes(normalizedSearch);
    const matchesLocation =
      !normalizedLocation || row.location.toLowerCase() === normalizedLocation;
    const matchesActivity =
      normalizedActivity === "all" ||
      (normalizedActivity === "recommendations" && row.recommendations > 0) ||
      (normalizedActivity === "detections" && row.detections > 0) ||
      (normalizedActivity === "high_activity" && row.recommendations + row.detections >= 5);

    return matchesSearch && matchesLocation && matchesActivity;
  });

  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);
  const start = (safePage - 1) * safeLimit;

  return {
    farmers: filteredRows.slice(start, start + safeLimit),
    filters: {
      locations: [...new Set(rows.map((row) => row.location).filter(Boolean))].sort(),
    },
    total: filteredRows.length,
    pagination: {
      page: safePage,
      limit: safeLimit,
      totalPages: Math.max(1, Math.ceil(filteredRows.length / safeLimit)),
    },
  };
}

export async function getFarmerStats() {
  const rows = isMongoReady() ? await getMongoFarmerRows() : getMemoryFarmerRows();
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const activeTodayUserIds = isMongoReady()
    ? await getMongoActiveTodayUserIds()
    : getMemoryActiveTodayUserIds();

  return {
    totalFarmers: rows.length,
    activeToday: rows.filter((row) => activeTodayUserIds.has(String(row.userId))).length,
    newThisMonth: rows.filter((row) => new Date(row.createdAt) >= monthStart).length,
    totalFarmArea: rows.reduce((sum, row) => sum + parseFarmArea(row.farmSize), 0),
    generatedAt: new Date().toISOString(),
  };
}

export async function getFarmerById(id) {
  const rows = isMongoReady() ? await getMongoFarmerRows() : getMemoryFarmerRows();
  const farmer = rows.find((entry) => String(entry.id) === String(id));
  if (!farmer) {
    return null;
  }

  const recentActivity = isMongoReady()
    ? await getMongoRecentFarmerActivity(id)
    : getMemoryRecentFarmerActivity(id);

  return toFarmerDetail(farmer, recentActivity);
}

export async function deleteFarmerById(id, deletedBy) {
  if (isMongoReady()) {
    const user = await User.findOne({ _id: id, role: "farmer" });
    if (!user || !isVisibleFarmer(user)) {
      return false;
    }

    await Promise.all([
      FarmerProfile.deleteOne({ userId: user._id }),
      RefreshToken.deleteMany({ userId: user._id }),
      UserSettings.deleteOne({ userId: user._id }),
      User.deleteOne({ _id: user._id }),
      Activity.deleteMany({ userId: user._id }),
    ]);

    await ActivityLog.create({
      actionType: "farmer_deleted",
      details: { farmerId: String(user._id), by: deletedBy },
    });

    return true;
  }

  const user = db.users.find((entry) => String(entry.id) === String(id) && isVisibleFarmer(entry));
  if (!user) {
    return false;
  }

  db.users = db.users.filter((entry) => String(entry.id) !== String(id));
  db.farmerProfiles = db.farmerProfiles.filter((entry) => String(entry.userId) !== String(id));
  db.refreshTokens = db.refreshTokens.filter((entry) => String(entry.userId) !== String(id));
  db.userSettings = db.userSettings.filter((entry) => String(entry.userId) !== String(id));
  db.activityLogs = db.activityLogs.filter((entry) => String(entry.userId) !== String(id));
  db.activityLogs.push({
    id: uuid(),
    actionType: "farmer_deleted",
    details: { farmerId: String(id), by: deletedBy },
    createdAt: new Date().toISOString(),
  });

  return true;
}
