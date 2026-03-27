import { createContext, useContext, useState, useEffect } from "react";

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
    // Load profile from localStorage on mount
    const savedProfile = localStorage.getItem("farmerProfile");
    if (savedProfile) {
      setFarmerProfile(JSON.parse(savedProfile));
    }
  }, []);

  const login = (email, password, role) => {
    // Mock login
    setUser({
      name: role === "farmer" ? "John Farmer" : "Admin User",
      email,
      role,
    });

    if (role === "farmer") {
      const savedProfile = localStorage.getItem("farmerProfile");
      if (savedProfile) {
        setFarmerProfile(JSON.parse(savedProfile));
      } else {
        setFarmerProfile(DEFAULT_PROFILE);
        localStorage.setItem("farmerProfile", JSON.stringify(DEFAULT_PROFILE));
      }
    }
  };

  const logout = () => {
    setUser(null);
    setFarmerProfile(null);
  };

  const updateFarmerProfile = (profile) => {
    setFarmerProfile(profile);
    localStorage.setItem("farmerProfile", JSON.stringify(profile));
  };

  return (
    <AuthContext.Provider value={{ user, farmerProfile, login, logout, updateFarmerProfile }}>
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
