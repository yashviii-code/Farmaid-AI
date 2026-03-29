import { motion } from "motion/react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, User, MapPin, Phone, Mail, Award, Calendar, Edit2, Camera, Sprout, Clock, X, Check } from "lucide-react";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { getLocalizedCopy } from "../lib/getLocalizedCopy";
import { getRecentActivities } from "../api/activity.api";

const PROFILE_COPY = {
  english: {
    title: "Farmer Profile",
    back: "Back",
    placeholders: {
      name: "John Farmer",
      email: "john.farmer@example.com",
      phone: "+91 98765 43210",
      location: "Punjab, India",
      totalArea: "45 Acres",
      soilType: "Alluvial Soil",
      irrigationMethod: "Drip & Sprinkler",
      mainCrops: "Wheat, Rice, Cotton",
      emailLabel: "Email",
      phoneLabel: "Phone",
      totalAreaLabel: "Total Area",
      soilTypeLabel: "Soil Type",
      irrigationMethodLabel: "Irrigation Method",
      mainCropsLabel: "Main Crops",
    },
    stats: ["Crops Analyzed", "Diseases Detected", "Years Active", "Accuracy Score"],
    recentActivityTitle: "Recent Activity",
    recentActivityLoading: "Loading recent activity...",
    recentActivityEmpty: "No recent activity yet.",
    recentActivityError: "Unable to load recent activity right now.",
    farmDetailsTitle: "Farm Details",
    unsavedChanges: "You have unsaved changes",
    editProfile: "Edit Profile",
    saveChanges: "Save Changes",
    cancel: "Cancel",
  },
  hindi: {
    title: "किसान प्रोफाइल",
    back: "वापस",
    placeholders: {
      name: "जॉन फार्मर",
      email: "john.farmer@example.com",
      phone: "+91 98765 43210",
      location: "पंजाब, भारत",
      totalArea: "45 एकड़",
      soilType: "जलोढ़ मिट्टी",
      irrigationMethod: "ड्रिप और स्प्रिंकलर",
      mainCrops: "गेहूं, धान, कपास",
      emailLabel: "ईमेल",
      phoneLabel: "फोन",
      totalAreaLabel: "कुल क्षेत्र",
      soilTypeLabel: "मिट्टी का प्रकार",
      irrigationMethodLabel: "सिंचाई विधि",
      mainCropsLabel: "मुख्य फसलें",
    },
    stats: ["विश्लेषित फसलें", "पहचाने गए रोग", "सक्रिय वर्ष", "सटीकता स्कोर"],
    recentActivityTitle: "हाल की गतिविधि",
    recentActivity: [
      { action: "धान की फसल सिफारिश बनाई गई", date: "आज, 10:30 AM" },
      { action: "गेहूं में लीफ ब्लाइट की पहचान हुई", date: "कल, 2:15 PM" },
      { action: "खेत का स्थान पंजाब में अपडेट किया गया", date: "3 दिन पहले" },
      { action: "मिट्टी की लैब रिपोर्ट अपलोड की", date: "1 सप्ताह पहले" },
    ],
    farmDetailsTitle: "खेत का विवरण",
    unsavedChanges: "आपके पास बिना सहेजे परिवर्तन हैं",
    editProfile: "प्रोफाइल संपादित करें",
    saveChanges: "परिवर्तन सहेजें",
    cancel: "रद्द करें",
  },
  gujarati: {
    title: "ખેડૂત પ્રોફાઇલ",
    back: "પાછા",
    placeholders: {
      name: "જોન ફાર્મર",
      email: "john.farmer@example.com",
      phone: "+91 98765 43210",
      location: "પંજાબ, ભારત",
      totalArea: "45 એકર",
      soilType: "અલ્યુવિયલ માટી",
      irrigationMethod: "ડ્રિપ અને સ્પ્રિંકલર",
      mainCrops: "ઘઉં, ચોખા, કપાસ",
      emailLabel: "ઇમેઇલ",
      phoneLabel: "ફોન",
      totalAreaLabel: "કુલ વિસ્તાર",
      soilTypeLabel: "માટીનો પ્રકાર",
      irrigationMethodLabel: "સિંચાઈ પદ્ધતિ",
      mainCropsLabel: "મુખ્ય પાકો",
    },
    stats: ["વિશ્લેષિત પાકો", "ઓળખાયેલા રોગો", "સક્રિય વર્ષો", "ચોકસાઈ સ્કોર"],
    recentActivityTitle: "તાજેતરની પ્રવૃત્તિ",
    recentActivity: [
      { action: "ચોખા માટે પાક ભલામણ તૈયાર થઈ", date: "આજે, 10:30 AM" },
      { action: "ઘઉંમાં લીફ બ્લાઇટ ઓળખાયું", date: "ગઈકાલે, 2:15 PM" },
      { action: "ફાર્મનું સ્થાન પંજાબ તરીકે અપડેટ થયું", date: "3 દિવસ પહેલા" },
      { action: "માટી લેબ રિપોર્ટ અપલોડ કરી", date: "1 અઠવાડિયા પહેલા" },
    ],
    farmDetailsTitle: "ફાર્મ વિગતો",
    unsavedChanges: "તમારી પાસે અસાચવેલા ફેરફારો છે",
    editProfile: "પ્રોફાઇલ સંપાદિત કરો",
    saveChanges: "ફેરફારો સાચવો",
    cancel: "રદ કરો",
  },
};

export function Profile() {
  const navigate = useNavigate();
  const { farmerProfile, updateFarmerProfile } = useAuth();
  const { language } = useLanguage();
  const copy = getLocalizedCopy(language, PROFILE_COPY);
  const defaultProfile = {
    name: copy.placeholders.name,
    email: copy.placeholders.email,
    phone: copy.placeholders.phone,
    location: copy.placeholders.location,
    totalArea: copy.placeholders.totalArea,
    soilType: copy.placeholders.soilType,
    irrigationMethod: copy.placeholders.irrigationMethod,
    mainCrops: copy.placeholders.mainCrops,
  };
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [profileImage, setProfileImage] = useState(farmerProfile?.profileImage || "");
  const [activities, setActivities] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [activityError, setActivityError] = useState("");
  const fileInputRef = useRef(null);
  
  const [editedProfile, setEditedProfile] = useState(
    farmerProfile || defaultProfile
  );

  const userStats = [
    { label: copy.stats[0], value: "24", icon: Sprout },
    { label: copy.stats[1], value: "12", icon: Camera },
    { label: copy.stats[2], value: "2", icon: Calendar },
    { label: copy.stats[3], value: "98%", icon: Award },
  ];

  const formatActivityDate = (dateValue) => {
    if (!dateValue) {
      return "";
    }

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) {
      return "";
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const targetDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diffInDays = Math.round((today - targetDay) / (1000 * 60 * 60 * 24));

    if (diffInDays <= 0) {
      return `Today, ${date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
    }

    if (diffInDays === 1) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
    }

    return `${diffInDays} days ago`;
  };

  const handleInputChange = (field, value) => {
    setEditedProfile((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setProfileImage(base64String);
        setEditedProfile((prev) => ({ ...prev, profileImage: base64String }));
        setHasChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = () => {
    updateFarmerProfile(editedProfile);
    setIsEditMode(false);
    setHasChanges(false);
  };

  const handleCancel = () => {
    setEditedProfile(farmerProfile || editedProfile);
    setProfileImage(farmerProfile?.profileImage || "");
    setIsEditMode(false);
    setHasChanges(false);
  };

  useEffect(() => {
    if (!farmerProfile && !hasChanges && !isEditMode) {
      setEditedProfile(defaultProfile);
    }
  }, [language, farmerProfile, hasChanges, isEditMode]);

  useEffect(() => {
    let isMounted = true;

    async function loadActivities() {
      setActivityLoading(true);
      setActivityError("");

      try {
        const data = await getRecentActivities(10);
        if (!isMounted) {
          return;
        }

        setActivities(data);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setActivityError(
          error?.response?.data?.error || copy.recentActivityError
        );
      } finally {
        if (isMounted) {
          setActivityLoading(false);
        }
      }
    }

    loadActivities();

    return () => {
      isMounted = false;
    };
  }, [copy.recentActivityError]);

  const displayProfile = farmerProfile || editedProfile;
  const displayImage = profileImage || displayProfile.profileImage;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-950 to-slate-950 text-white pb-12">
      {/* Navbar */}
      <nav className="relative z-10 bg-slate-950/80 backdrop-blur-xl border-b border-green-500/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>{copy.back}</span>
            </button>
            <div className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              {copy.title}
            </div>
            <div className="w-20"></div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="md:col-span-1 space-y-6">
            <div className="bg-slate-900/80 backdrop-blur-xl border border-green-500/20 rounded-3xl p-6 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-green-500/20 to-emerald-500/20"></div>
              
              <div className="relative mt-8 mb-4">
                <div className="w-32 h-32 mx-auto bg-slate-800 rounded-full border-4 border-slate-900 shadow-xl overflow-hidden flex items-center justify-center">
                  {displayImage ? (
                    <img src={displayImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-16 h-16 text-gray-400" />
                  )}
                </div>
                {isEditMode && (
                  <>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-1/2 translate-x-12 translate-y-2 bg-green-500 p-2 rounded-full text-white hover:bg-green-400 transition-colors shadow-lg"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </>
                )}
              </div>

              {isEditMode ? (
                <>
                  <input
                    type="text"
                    value={editedProfile.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="text-2xl font-bold text-white mb-1 bg-slate-800 w-full text-center rounded-lg p-2 border border-green-500/20"
                  />
                  <input
                    type="text"
                    value={editedProfile.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className="text-green-400 text-sm mb-6 bg-slate-800 w-full text-center rounded-lg p-2 border border-green-500/20"
                  />
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-white mb-1">{displayProfile.name}</h2>
                  <p className="text-green-400 text-sm mb-6 flex items-center justify-center gap-1">
                    <MapPin className="w-4 h-4" /> {displayProfile.location}
                  </p>
                </>
              )}

              <div className="space-y-3 text-left">
                {isEditMode ? (
                  <>
                    <input
                      type="email"
                      value={editedProfile.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="w-full text-gray-300 bg-slate-800 p-3 rounded-xl border border-green-500/20"
                      placeholder={copy.placeholders.emailLabel}
                    />
                    <input
                      type="tel"
                      value={editedProfile.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="w-full text-gray-300 bg-slate-800 p-3 rounded-xl border border-green-500/20"
                      placeholder={copy.placeholders.phoneLabel}
                    />
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3 text-gray-300 bg-slate-800/50 p-3 rounded-xl">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span className="text-sm truncate">{displayProfile.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300 bg-slate-800/50 p-3 rounded-xl">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <span className="text-sm">{displayProfile.phone}</span>
                    </div>
                  </>
                )}
              </div>

              {isEditMode ? (
                <div className="flex gap-3 mt-6">
                <Button 
                    onClick={handleSaveChanges}
                    className="flex-1 bg-green-600 hover:bg-green-500 text-white"
                  >
                    <Check className="w-4 h-4 mr-2" /> {copy.saveChanges}
                  </Button>
                  <Button 
                    onClick={handleCancel}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white border border-slate-600"
                  >
                    <X className="w-4 h-4 mr-2" /> {copy.cancel}
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={() => setIsEditMode(true)}
                  className="w-full mt-6 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                >
                  <Edit2 className="w-4 h-4 mr-2" /> {copy.editProfile}
                </Button>
              )}

              {hasChanges && isEditMode && (
                <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-200 text-sm text-center">
                  {copy.unsavedChanges}
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Column - Stats & Activity */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="md:col-span-2 space-y-6">
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {userStats.map((stat, i) => (
                <div key={i} className="bg-slate-900/80 backdrop-blur-xl border border-green-500/20 rounded-2xl p-5 hover:border-green-500/50 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-green-500/20 p-2 rounded-lg text-green-400">
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
                  </div>
                  <div className="text-3xl font-bold text-white pl-1">{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Farm Details */}
            <div className="bg-slate-900/80 backdrop-blur-xl border border-green-500/20 rounded-3xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">{copy.farmDetailsTitle}</h3>
              {isEditMode ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={editedProfile.totalArea}
                    onChange={(e) => handleInputChange("totalArea", e.target.value)}
                    className="col-span-1 text-white bg-slate-800 p-3 rounded-lg border border-green-500/20"
                    placeholder={copy.placeholders.totalAreaLabel}
                  />
                  <input
                    type="text"
                    value={editedProfile.soilType}
                    onChange={(e) => handleInputChange("soilType", e.target.value)}
                    className="col-span-1 text-white bg-slate-800 p-3 rounded-lg border border-green-500/20"
                    placeholder={copy.placeholders.soilTypeLabel}
                  />
                  <input
                    type="text"
                    value={editedProfile.irrigationMethod}
                    onChange={(e) => handleInputChange("irrigationMethod", e.target.value)}
                    className="col-span-1 text-white bg-slate-800 p-3 rounded-lg border border-green-500/20"
                    placeholder={copy.placeholders.irrigationMethodLabel}
                  />
                  <input
                    type="text"
                    value={editedProfile.mainCrops}
                    onChange={(e) => handleInputChange("mainCrops", e.target.value)}
                    className="col-span-1 text-white bg-slate-800 p-3 rounded-lg border border-green-500/20"
                    placeholder={copy.placeholders.mainCropsLabel}
                  />
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-gray-400">{copy.placeholders.totalAreaLabel}</div>
                    <div className="text-lg font-semibold text-white">{displayProfile.totalArea}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-400">{copy.placeholders.soilTypeLabel}</div>
                    <div className="text-lg font-semibold text-white">{displayProfile.soilType}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-400">{copy.placeholders.irrigationMethodLabel}</div>
                    <div className="text-lg font-semibold text-white">{displayProfile.irrigationMethod}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-400">{copy.placeholders.mainCropsLabel}</div>
                    <div className="text-lg font-semibold text-white">{displayProfile.mainCrops}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-900/80 backdrop-blur-xl border border-green-500/20 rounded-3xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-400" /> {copy.recentActivityTitle}
              </h3>
              <div className="space-y-4">
                {activityLoading ? (
                  <div className="text-sm text-gray-400">{copy.recentActivityLoading}</div>
                ) : activityError ? (
                  <div className="text-sm text-red-300">{activityError}</div>
                ) : activities.length ? (
                  activities.map((activity, i) => (
                    <div key={`${activity.createdAt}-${i}`} className="flex gap-4 items-start relative pb-4 border-b border-slate-800 last:border-0 last:pb-0">
                      <div className="w-2 h-2 mt-2 rounded-full bg-green-500 ring-4 ring-green-500/20 shrink-0"></div>
                      <div>
                        <div className="text-white font-medium">{activity.message}</div>
                        <div className="text-sm text-gray-500 mt-1">{formatActivityDate(activity.createdAt)}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-400">{copy.recentActivityEmpty}</div>
                )}
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}
