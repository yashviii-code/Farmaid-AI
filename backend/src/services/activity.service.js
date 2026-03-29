import { v4 as uuid } from "uuid";
import { isMongoReady } from "../config/database.js";
import { db } from "../data/store.js";
import { Activity } from "../models/activity.model.js";

function normalizeActivity(activity) {
  return {
    message: activity.message,
    createdAt: activity.createdAt,
  };
}

export async function createActivity({ userId, type, message }) {
  if (!userId) {
    return null;
  }

  if (isMongoReady()) {
    const activity = await Activity.create({
      userId,
      type,
      message,
    });

    return normalizeActivity(activity);
  }

  const activity = {
    id: uuid(),
    userId: String(userId),
    type,
    message,
    createdAt: new Date().toISOString(),
  };

  db.activityLogs.push(activity);
  return normalizeActivity(activity);
}

export async function getRecentActivities(userId, limit = 10) {
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 10);

  if (isMongoReady()) {
    const activities = await Activity.find({ userId })
      .sort({ createdAt: -1 })
      .limit(safeLimit)
      .select({ message: 1, createdAt: 1, _id: 0 })
      .lean();

    return activities.map(normalizeActivity);
  }

  return db.activityLogs
    .filter((entry) => String(entry.userId) === String(userId))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, safeLimit)
    .map(normalizeActivity);
}
