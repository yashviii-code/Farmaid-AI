import { isMongoReady } from "../config/database.js";
import { db, seedFarmer } from "../data/store.js";
import { FarmerProfile } from "../models/FarmerProfile.js";
import { User } from "../models/User.js";

function toFarmerProfileObject(profile) {
  return {
    userId: String(profile.userId || profile.userId?._id || profile.userId),
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
    totalArea: profile.totalArea,
    soilType: profile.soilType,
    irrigationMethod: profile.irrigationMethod,
    mainCrops: profile.mainCrops,
    profileImage: profile.profileImage || "",
    updatedAt: profile.updatedAt,
  };
}

export async function getUserById(userId) {
  if (isMongoReady()) {
    const user = await User.findById(userId);
    return user
      ? {
          id: String(user._id),
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          phone: user.phone,
          location: user.location,
          language: user.language,
          theme: user.theme,
          passwordHash: user.passwordHash,
        }
      : null;
  }

  return db.users.find((entry) => entry.id === userId) || null;
}

export async function getMyProfile(user) {
  if (user.role === "admin") {
    return {
      name: user.fullName,
      email: user.email,
      phone: user.phone,
      location: user.location,
      bio: "",
    };
  }

  if (isMongoReady()) {
    let profile = await FarmerProfile.findOne({ userId: user.id });
    if (!profile) {
      profile = await FarmerProfile.create({
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
      });
    }

    return toFarmerProfileObject(profile);
  }

  const profile = db.farmerProfiles.find((p) => p.userId === user.id);
  if (profile) {
    return profile;
  }

  return seedFarmer(user);
}

export async function updateMyProfile(user, payload) {
  if (user.role === "admin") {
    const updates = {
      fullName: payload.name ?? user.fullName,
      email: payload.email ?? user.email,
      phone: payload.phone ?? user.phone,
      location: payload.location ?? user.location,
    };

    if (isMongoReady()) {
      const updated = await User.findByIdAndUpdate(user.id, updates, { new: true });
      return {
        name: updated.fullName,
        email: updated.email,
        phone: updated.phone,
        location: updated.location,
      };
    }

    user.fullName = updates.fullName;
    user.email = updates.email;
    user.phone = updates.phone;
    user.location = updates.location;
    user.updatedAt = new Date().toISOString();

    return {
      name: user.fullName,
      email: user.email,
      phone: user.phone,
      location: user.location,
    };
  }

  const allowedFields = [
    "name",
    "email",
    "phone",
    "location",
    "totalArea",
    "soilType",
    "irrigationMethod",
    "mainCrops",
    "profileImage",
  ];

  if (isMongoReady()) {
    const updates = {};
    for (const key of allowedFields) {
      if (payload[key] !== undefined) {
        updates[key] = payload[key];
      }
    }

    const profile = await FarmerProfile.findOneAndUpdate({ userId: user.id }, updates, { new: true });
    if (!profile) {
      return null;
    }

    return toFarmerProfileObject(profile);
  }

  const profile = db.farmerProfiles.find((p) => p.userId === user.id);
  if (!profile) {
    return null;
  }

  for (const key of allowedFields) {
    if (payload[key] !== undefined) {
      profile[key] = payload[key];
    }
  }
  profile.updatedAt = new Date().toISOString();
  return profile;
}
