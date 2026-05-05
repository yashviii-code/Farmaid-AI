import { isMongoReady } from "../config/database.js";
import { db } from "../data/store.js";
import { UserSettings } from "../models/UserSettings.js";

export async function getMySettings(user) {
  if (isMongoReady()) {
    let settings = await UserSettings.findOne({ userId: user.id });
    if (!settings) {
      settings = await UserSettings.create({
        userId: user.id,
        notifications: true,
        twoFactor: false,
        automaticBackups: true,
        cacheSize: "256 MB",
        language: user.language || "english",
        theme: user.theme || "dark",
      });
    }
    return settings.toObject();
  }

  let settings = db.userSettings.find((entry) => entry.userId === user.id);
  if (!settings) {
    settings = {
      userId: user.id,
      notifications: true,
      twoFactor: false,
      automaticBackups: true,
      cacheSize: "256 MB",
      language: user.language || "english",
      theme: user.theme || "dark",
      updatedAt: new Date().toISOString(),
    };
    db.userSettings.push(settings);
  }

  return settings;
}

export async function updateMySettings(user, payload) {
  if (isMongoReady()) {
    const updated = await UserSettings.findOneAndUpdate(
      { userId: user.id },
      { $set: payload },
      { new: true, upsert: true },
    );
    return updated.toObject();
  }

  let settings = db.userSettings.find((entry) => entry.userId === user.id);
  if (!settings) {
    settings = { userId: user.id };
    db.userSettings.push(settings);
  }

  Object.assign(settings, payload, { updatedAt: new Date().toISOString() });
  return settings;
}
