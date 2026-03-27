import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import { isMongoReady } from "../config/database.js";
import { db, seedFarmer } from "../data/store.js";
import { RefreshToken } from "../models/RefreshToken.js";
import { User } from "../models/User.js";
import { UserSettings } from "../models/UserSettings.js";
import { FarmerProfile } from "../models/FarmerProfile.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/tokens.js";

function toPublicUser(user) {
    return {
        id: String(user._id || user.id),
        fullName: user.fullName,
        email: user.email,
        role: user.role,
    };
}

export async function registerUser({ fullName, email, password }) {
    const normalizedEmail = String(email).toLowerCase();

    if (isMongoReady()) {
        const existing = await User.findOne({ email: normalizedEmail });
        if (existing) {
            return { error: "Email already registered", status: 409 };
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({
            fullName,
            email: normalizedEmail,
            passwordHash,
            role: "farmer",
            phone: "",
            location: "",
            language: "english",
            theme: "dark",
        });

        await FarmerProfile.create({
            userId: user._id,
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

        await UserSettings.create({
            userId: user._id,
            notifications: true,
            twoFactor: false,
            automaticBackups: true,
            cacheSize: "256 MB",
            language: user.language,
            theme: user.theme,
        });

        const accessToken = signAccessToken({ sub: String(user._id), role: user.role });
        const refreshToken = signRefreshToken({ sub: String(user._id), role: user.role });
        await RefreshToken.create({ token: refreshToken, userId: user._id });

        return {
            user: toPublicUser(user),
            accessToken,
            refreshToken,
        };
    }

    const existing = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
        return { error: "Email already registered", status: 409 };
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = {
        id: uuid(),
        fullName,
        email: normalizedEmail,
        passwordHash,
        role: "farmer",
        phone: "",
        location: "",
        language: "english",
        theme: "dark",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    db.users.push(user);
    seedFarmer(user);

    const accessToken = signAccessToken({ sub: user.id, role: user.role });
    const refreshToken = signRefreshToken({ sub: user.id, role: user.role });
    db.refreshTokens.push({ token: refreshToken, userId: user.id, createdAt: new Date().toISOString() });

    return {
        user: toPublicUser(user),
        accessToken,
        refreshToken,
    };
}

export async function loginUser({ email, password, role }) {
    const normalizedEmail = String(email).toLowerCase();

    let user;
    if (isMongoReady()) {
        user = await User.findOne({ email: normalizedEmail });
    } else {
        user = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
    }

    if (!user) {
        return { error: "Invalid credentials", status: 401 };
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
        return { error: "Invalid credentials", status: 401 };
    }

    if (role && role !== user.role) {
        return { error: "Role mismatch", status: 403 };
    }

    const userId = String(user._id || user.id);
    const accessToken = signAccessToken({ sub: userId, role: user.role });
    const refreshToken = signRefreshToken({ sub: userId, role: user.role });

    if (isMongoReady()) {
        await RefreshToken.create({ token: refreshToken, userId });
    } else {
        db.refreshTokens.push({ token: refreshToken, userId, createdAt: new Date().toISOString() });
    }

    return {
        user: toPublicUser(user),
        accessToken,
        refreshToken,
    };
}

export async function refreshAccessToken(refreshToken) {
    if (!refreshToken) {
        return { error: "refreshToken is required", status: 400 };
    }

    if (isMongoReady()) {
        const exists = await RefreshToken.findOne({ token: refreshToken });
        if (!exists) {
            return { error: "Invalid refresh token", status: 401 };
        }
    } else {
        const exists = db.refreshTokens.find((entry) => entry.token === refreshToken);
        if (!exists) {
            return { error: "Invalid refresh token", status: 401 };
        }
    }

    try {
        const decoded = verifyRefreshToken(refreshToken);
        const accessToken = signAccessToken({ sub: decoded.sub, role: decoded.role });
        return { accessToken };
    } catch {
        return { error: "Invalid refresh token", status: 401 };
    }
}

export async function logoutUser(refreshToken) {
    if (isMongoReady()) {
        await RefreshToken.deleteOne({ token: refreshToken });
        return;
    }

    db.refreshTokens = db.refreshTokens.filter((entry) => entry.token !== refreshToken);
}
