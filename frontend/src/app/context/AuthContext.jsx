import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, logoutUser, registerFarmer } from "../api/auth.api";
import { getMyProfile, updateMyProfile } from "../api/users.api";

const AuthContext = createContext(undefined);

const DEFAULT_PROFILE = {
  name: "John Farmer",
  email: "john.farmer@example.com",
  phone: "+91 98765 43210",
  location: "Punjab, India",
  totalArea: "45 Acres",
  soilType: "Alluvial Soil",
  irrigationMethod: "Drip & Sprinkler",
  mainCrops: "Wheat, Rice, Cotton",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [farmerProfile, setFarmerProfile] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("farmaidUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Load profile from localStorage on mount
    const savedProfile = localStorage.getItem("farmerProfile");
    if (savedProfile) {
      setFarmerProfile(JSON.parse(savedProfile));
    }
  }, []);

  const login = async (email, password, role) => {
    const data = await loginUser({ email, password, role });
    const nextUser = {
      name: data.user.fullName,
      email: data.user.email,
      role: data.user.role,
    };

    setUser(nextUser);
    localStorage.setItem("farmaidUser", JSON.stringify(nextUser));

    if (data.user.role === "farmer") {
      try {
        const profileData = await getMyProfile();
        const profile = profileData.profile || DEFAULT_PROFILE;
        setFarmerProfile(profile);
        localStorage.setItem("farmerProfile", JSON.stringify(profile));
      } catch {
        setFarmerProfile(DEFAULT_PROFILE);
        localStorage.setItem("farmerProfile", JSON.stringify(DEFAULT_PROFILE));
      }
    } else {
      setFarmerProfile(null);
      localStorage.removeItem("farmerProfile");
    }

    return data;
  };

  const signup = async (fullName, email, password) => {
    const data = await registerFarmer({ fullName, email, password });
    const nextUser = {
      name: data.user.fullName,
      email: data.user.email,
      role: data.user.role,
    };

    setUser(nextUser);
    localStorage.setItem("farmaidUser", JSON.stringify(nextUser));

    try {
      const profileData = await getMyProfile();
      const profile = profileData.profile || {
        ...DEFAULT_PROFILE,
        name: fullName,
        email,
      };

      setFarmerProfile(profile);
      localStorage.setItem("farmerProfile", JSON.stringify(profile));
    } catch {
      const fallbackProfile = { ...DEFAULT_PROFILE, name: fullName, email };
      setFarmerProfile(fallbackProfile);
      localStorage.setItem("farmerProfile", JSON.stringify(fallbackProfile));
    }

    return data;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch {
      // Ignore network failures during logout cleanup.
    }

    setUser(null);
    setFarmerProfile(null);
    localStorage.removeItem("farmaidUser");
    localStorage.removeItem("farmerProfile");
  };

  const updateFarmerProfile = async (profile) => {
    try {
      const data = await updateMyProfile(profile);
      const updatedProfile = data.profile || profile;
      setFarmerProfile(updatedProfile);
      localStorage.setItem("farmerProfile", JSON.stringify(updatedProfile));
      return updatedProfile;
    } catch {
      setFarmerProfile(profile);
      localStorage.setItem("farmerProfile", JSON.stringify(profile));
      return profile;
    }
  };

  return (
    <AuthContext.Provider value={{ user, farmerProfile, login, signup, logout, updateFarmerProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
