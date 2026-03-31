import { isMongoReady } from "../config/database.js";
import { db } from "../data/store.js";
import { Activity } from "../models/activity.model.js";
import { CropPrediction } from "../models/CropPrediction.js";
import { DiseaseDetection } from "../models/DiseaseDetection.js";
import { User } from "../models/User.js";

const MONTH_WINDOW = 6;
const OTHER_CROPS_LABEL = "Others";
const TEST_FARMER_NAME = "API Test Farmer";
const TEST_EMAIL_PATTERN = /^apitest\+/i;

function getLastMonths(windowSize = MONTH_WINDOW) {
  const months = [];
  const now = new Date();

  for (let index = windowSize - 1; index >= 0; index -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
    months.push({
      key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
      label: date.toLocaleString("en-US", { month: "short" }),
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      start: new Date(date.getFullYear(), date.getMonth(), 1),
      end: new Date(date.getFullYear(), date.getMonth() + 1, 1),
    });
  }

  return months;
}

function roundPercentage(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function formatCropName(value) {
  const text = String(value || "").trim();
  if (!text) {
    return OTHER_CROPS_LABEL;
  }

  if (text === text.toLowerCase()) {
    return text.replace(/\b\w/g, (character) => character.toUpperCase());
  }

  return text;
}

function mapCountsToMonths(months, countsByKey) {
  return months.map((month) => Number(countsByKey.get(month.key) || 0));
}

function isProductionFarmerRecord(user) {
  return (
    user?.role === "farmer" &&
    String(user?.fullName || "").trim() !== TEST_FARMER_NAME &&
    !TEST_EMAIL_PATTERN.test(String(user?.email || "").trim())
  );
}

async function getMongoStats() {
  const [farmerUsers, totalCropPredictions, totalDiseaseDetections] = await Promise.all([
    User.find({ role: "farmer" }).select({ _id: 1, fullName: 1, email: 1, role: 1 }).lean(),
    CropPrediction.countDocuments(),
    DiseaseDetection.countDocuments(),
  ]);

  const realFarmerUsers = farmerUsers.filter(isProductionFarmerRecord);
  const totalFarmers = realFarmerUsers.length;
  const realFarmerIds = new Set(realFarmerUsers.map((user) => String(user._id)));

  const activeSince = new Date();
  activeSince.setDate(activeSince.getDate() - 30);

  const activeUsers = await Activity.distinct("userId", {
    createdAt: { $gte: activeSince },
  });
  const activeRealUsers = activeUsers.filter((userId) => realFarmerIds.has(String(userId)));

  const systemUsage =
    totalFarmers > 0 ? roundPercentage((activeRealUsers.length / totalFarmers) * 100) : 0;

  return {
    totalFarmers,
    totalCropPredictions,
    totalDiseaseDetections,
    systemUsage,
  };
}

function getMemoryStats() {
  const realFarmers = db.users.filter(isProductionFarmerRecord);
  const totalFarmers = realFarmers.length;
  const totalCropPredictions = db.cropPredictions.length;
  const totalDiseaseDetections = db.diseaseDetections.length;
  const realFarmerIds = new Set(realFarmers.map((user) => String(user.id)));

  const activeSince = new Date();
  activeSince.setDate(activeSince.getDate() - 30);

  const activeUsers = new Set(
    db.activityLogs
      .filter((entry) => new Date(entry.createdAt) >= activeSince)
      .map((entry) => String(entry.userId))
      .filter((userId) => userId && realFarmerIds.has(userId)),
  );

  const systemUsage =
    totalFarmers > 0 ? roundPercentage((activeUsers.size / totalFarmers) * 100) : 0;

  return {
    totalFarmers,
    totalCropPredictions,
    totalDiseaseDetections,
    systemUsage,
  };
}

async function getMongoAnalytics() {
  const months = getLastMonths();
  const startDate = months[0]?.start;

  const [cropRows, diseaseRows] = await Promise.all([
    CropPrediction.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
    ]),
    DiseaseDetection.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
    ]),
  ]);

  const cropCounts = new Map(
    cropRows.map((row) => [
      `${row._id.year}-${String(row._id.month).padStart(2, "0")}`,
      row.count,
    ]),
  );
  const diseaseCounts = new Map(
    diseaseRows.map((row) => [
      `${row._id.year}-${String(row._id.month).padStart(2, "0")}`,
      row.count,
    ]),
  );

  return {
    months: months.map((month) => month.label),
    cropData: mapCountsToMonths(months, cropCounts),
    diseaseData: mapCountsToMonths(months, diseaseCounts),
  };
}

function getMemoryAnalytics() {
  const months = getLastMonths();
  const cropCounts = new Map();
  const diseaseCounts = new Map();

  for (const prediction of db.cropPredictions) {
    const date = new Date(prediction.createdAt || prediction.updatedAt || Date.now());
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    cropCounts.set(key, (cropCounts.get(key) || 0) + 1);
  }

  for (const detection of db.diseaseDetections) {
    const date = new Date(detection.createdAt || detection.updatedAt || Date.now());
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    diseaseCounts.set(key, (diseaseCounts.get(key) || 0) + 1);
  }

  return {
    months: months.map((month) => month.label),
    cropData: mapCountsToMonths(months, cropCounts),
    diseaseData: mapCountsToMonths(months, diseaseCounts),
  };
}

async function getMongoCropDistribution() {
  const rows = await CropPrediction.aggregate([
    {
      $project: {
        crop: { $ifNull: [{ $arrayElemAt: ["$recommendations.crop", 0] }, OTHER_CROPS_LABEL] },
      },
    },
    {
      $group: {
        _id: "$crop",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);

  const total = rows.reduce((sum, row) => sum + row.count, 0);
  if (!total) {
    return [];
  }

  const topRows = rows.slice(0, 4);
  const otherCount = rows.slice(4).reduce((sum, row) => sum + row.count, 0);
  const distribution = topRows.map((row) => ({
    name: formatCropName(row._id),
    value: roundPercentage((row.count / total) * 100),
  }));

  if (otherCount > 0) {
    distribution.push({
      name: OTHER_CROPS_LABEL,
      value: roundPercentage((otherCount / total) * 100),
    });
  }

  return distribution;
}

function getMemoryCropDistribution() {
  const counts = new Map();

  for (const prediction of db.cropPredictions) {
    const crop = formatCropName(prediction?.recommendations?.[0]?.crop || OTHER_CROPS_LABEL);
    counts.set(crop, (counts.get(crop) || 0) + 1);
  }

  const rows = [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((left, right) => right.count - left.count);

  const total = rows.reduce((sum, row) => sum + row.count, 0);
  if (!total) {
    return [];
  }

  const topRows = rows.slice(0, 4);
  const otherCount = rows.slice(4).reduce((sum, row) => sum + row.count, 0);
  const distribution = topRows.map((row) => ({
    name: row.name,
    value: roundPercentage((row.count / total) * 100),
  }));

  if (otherCount > 0) {
    distribution.push({
      name: OTHER_CROPS_LABEL,
      value: roundPercentage((otherCount / total) * 100),
    });
  }

  return distribution;
}

export async function getDashboardStats() {
  return isMongoReady() ? getMongoStats() : getMemoryStats();
}

export async function getDashboardAnalytics() {
  return isMongoReady() ? getMongoAnalytics() : getMemoryAnalytics();
}

export async function getDashboardCropDistribution() {
  return isMongoReady() ? getMongoCropDistribution() : getMemoryCropDistribution();
}
