import { isMongoReady } from "../config/database.js";
import { db } from "../data/store.js";
import { Activity } from "../models/activity.model.js";

const VALID_TYPES = ["recommendation", "disease", "upload", "auth", "profile", "crop"];

/**
 * Fetch filtered and paginated logs.
 */
export async function getLogs({ type, page = 1, limit = 20 }) {
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const safePage = Math.max(Number(page) || 1, 1);
  const skip = (safePage - 1) * safeLimit;

  if (isMongoReady()) {
    const filter = {};
    if (type && VALID_TYPES.includes(type)) {
      filter.type = type;
    }

    const [logs, total] = await Promise.all([
      Activity.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit)
        .populate("userId", "fullName location")
        .lean(),
      Activity.countDocuments(filter),
    ]);

    const normalizedLogs = logs.map((log) => ({
      id: String(log._id),
      userName: log.userName || log.userId?.fullName || "Unknown User",
      type: log.type,
      message: log.message,
      location: log.location || log.userId?.location || "",
      createdAt: log.createdAt,
    }));

    return {
      logs: normalizedLogs,
      total,
      pagination: {
        page: safePage,
        limit: safeLimit,
        totalPages: Math.max(1, Math.ceil(total / safeLimit)),
      },
    };
  }

  // In-memory fallback
  let filtered = [...db.activityLogs];
  if (type && VALID_TYPES.includes(type)) {
    filtered = filtered.filter((entry) => entry.type === type);
  }
  filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const total = filtered.length;
  const logs = filtered.slice(skip, skip + safeLimit).map((log) => {
    const user = db.users.find((u) => String(u.id) === String(log.userId));
    return {
      id: log.id,
      userName: log.userName || user?.fullName || "Unknown User",
      type: log.type || "profile",
      message: log.message || log.actionType || "Activity recorded",
      location: log.location || user?.location || "",
      createdAt: log.createdAt,
    };
  });

  return {
    logs,
    total,
    pagination: {
      page: safePage,
      limit: safeLimit,
      totalPages: Math.max(1, Math.ceil(total / safeLimit)),
    },
  };
}

/**
 * Compute stats for the logs dashboard.
 */
export async function getLogsStats() {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  if (isMongoReady()) {
    const [totalActivities, todayLogs, activeUsersResult] = await Promise.all([
      Activity.countDocuments(),
      Activity.countDocuments({ createdAt: { $gte: todayStart } }),
      Activity.distinct("userId", { createdAt: { $gte: todayStart } }),
    ]);

    return {
      totalActivities,
      todayLogs,
      activeUsers: activeUsersResult.length,
      avgResponseTime: "1.2s",
    };
  }

  // In-memory fallback
  const total = db.activityLogs.length;
  const todayLogs = db.activityLogs.filter(
    (log) => new Date(log.createdAt) >= todayStart,
  ).length;
  const activeUsersSet = new Set(
    db.activityLogs
      .filter((log) => new Date(log.createdAt) >= todayStart)
      .map((log) => String(log.userId)),
  );

  return {
    totalActivities: total,
    todayLogs,
    activeUsers: activeUsersSet.size,
    avgResponseTime: "1.2s",
  };
}
