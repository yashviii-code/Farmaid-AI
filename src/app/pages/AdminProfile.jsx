import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Save, Camera, Edit2, Award, Heart, Share2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedCopy } from '../lib/getLocalizedCopy';

const ADMIN_PROFILE_COPY = {
  english: {
    title: 'Admin Profile',
    subtitle: 'Manage your account settings and information',
    joined: 'Joined',
    editProfile: 'Edit Profile',
    cancel: 'Cancel',
    saveChanges: 'Save Changes',
    quickStats: ['Farmers Managed', 'Reports Generated', 'Recommendations'],
    form: {
      title: 'Personal Information',
      fullName: 'Full Name',
      role: 'Role',
      email: 'Email',
      phone: 'Phone',
      location: 'Location',
      bio: 'Bio',
    },
    cards: [
      { title: 'Achievements', description: 'Top Administrator' },
      { title: 'Favorite Tools', description: 'Disease Detection' },
      { title: 'Social', description: 'Connected' },
    ],
    defaults: {
      role: 'System Administrator',
      bio: 'Senior Agriculture Administrator',
    },
  },
  hindi: {
    title: 'एडमिन प्रोफाइल',
    subtitle: 'अपने खाते की सेटिंग्स और जानकारी प्रबंधित करें',
    joined: 'जुड़े',
    editProfile: 'प्रोफाइल संपादित करें',
    cancel: 'रद्द करें',
    saveChanges: 'परिवर्तन सहेजें',
    quickStats: ['प्रबंधित किसान', 'तैयार रिपोर्टें', 'सिफारिशें'],
    form: {
      title: 'व्यक्तिगत जानकारी',
      fullName: 'पूरा नाम',
      role: 'भूमिका',
      email: 'ईमेल',
      phone: 'फोन',
      location: 'स्थान',
      bio: 'परिचय',
    },
    cards: [
      { title: 'उपलब्धियाँ', description: 'शीर्ष प्रशासक' },
      { title: 'पसंदीदा टूल्स', description: 'रोग पहचान' },
      { title: 'सोशल', description: 'जुड़ा हुआ' },
    ],
    defaults: {
      role: 'सिस्टम प्रशासक',
      bio: 'वरिष्ठ कृषि प्रशासक',
    },
  },
  gujarati: {
    title: 'એડમિન પ્રોફાઇલ',
    subtitle: 'તમારી એકાઉન્ટ સેટિંગ્સ અને માહિતી સંચાલિત કરો',
    joined: 'જોડાયા',
    editProfile: 'પ્રોફાઇલ સંપાદિત કરો',
    cancel: 'રદ કરો',
    saveChanges: 'ફેરફારો સાચવો',
    quickStats: ['સંચાલિત ખેડૂત', 'બનાવેલા રિપોર્ટ્સ', 'ભલામણો'],
    form: {
      title: 'વ્યક્તિગત માહિતી',
      fullName: 'પૂર્ણ નામ',
      role: 'ભૂમિકા',
      email: 'ઇમેઇલ',
      phone: 'ફોન',
      location: 'સ્થાન',
      bio: 'બાયો',
    },
    cards: [
      { title: 'ઉપલબ્ધિઓ', description: 'શ્રેષ્ઠ પ્રશાસક' },
      { title: 'પ્રિય ટૂલ્સ', description: 'રોગ ઓળખ' },
      { title: 'સોશિયલ', description: 'જોડાયેલ' },
    ],
    defaults: {
      role: 'સિસ્ટમ એડમિનિસ્ટ્રેટર',
      bio: 'વરીષ્ઠ કૃષિ વહીવટકાર',
    },
  },
};

export function AdminProfile() {
  const { language } = useLanguage();
  const copy = getLocalizedCopy(language, ADMIN_PROFILE_COPY);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Admin User',
    email: 'admin@farmaid.com',
    phone: '+91 98765 43210',
    location: 'New Delhi',
    bio: copy.defaults.bio,
    role: copy.defaults.role,
    joinDate: 'Jan 1, 2024',
    farmersManaged: 2847,
    reportsGenerated: 3542,
    recommendationsMade: 15234,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  useEffect(() => {
    if (!isEditing) {
      setProfileData((prev) => ({
        ...prev,
        bio: copy.defaults.bio,
        role: copy.defaults.role,
      }));
    }
  }, [language, copy.defaults.bio, copy.defaults.role, isEditing]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">{copy.title}</h1>
        <p className="text-emerald-400">{copy.subtitle}</p>
      </div>

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-slate-900/60 to-slate-800/60 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-3xl font-bold">A</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full text-white hover:bg-blue-600 transition-colors"
              >
                <Camera size={16} />
              </motion.button>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">{profileData.name}</h2>
              <p className="text-emerald-400 font-semibold">{profileData.role}</p>
              <p className="text-slate-400 text-sm">{copy.joined} {profileData.joinDate}</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-xl hover:bg-emerald-600 transition-colors font-semibold"
          >
            <Edit2 size={16} />
            {isEditing ? copy.cancel : copy.editProfile}
          </motion.button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-700">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-emerald-400">{profileData.farmersManaged.toLocaleString()}</h3>
            <p className="text-slate-400 text-sm">{copy.quickStats[0]}</p>
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-blue-400">{profileData.reportsGenerated.toLocaleString()}</h3>
            <p className="text-slate-400 text-sm">{copy.quickStats[1]}</p>
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-purple-400">{profileData.recommendationsMade.toLocaleString()}</h3>
            <p className="text-slate-400 text-sm">{copy.quickStats[2]}</p>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">{copy.form.title}</h2>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-white font-semibold mb-2 block">{copy.form.fullName}</label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-800/50 text-white focus:border-emerald-500 focus:outline-none transition-colors ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}
              />
            </div>
            <div>
              <label className="text-white font-semibold mb-2 block">{copy.form.role}</label>
              <input
                type="text"
                name="role"
                value={profileData.role}
                disabled
                className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-800/50 text-white opacity-60 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-white font-semibold mb-2 block flex items-center gap-2">
                <Mail size={16} className="text-emerald-400" />
                {copy.form.email}
              </label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-800/50 text-white focus:border-emerald-500 focus:outline-none transition-colors ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}
              />
            </div>
            <div>
              <label className="text-white font-semibold mb-2 block flex items-center gap-2">
                <Phone size={16} className="text-emerald-400" />
                {copy.form.phone}
              </label>
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-800/50 text-white focus:border-emerald-500 focus:outline-none transition-colors ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}
              />
            </div>
          </div>

          <div>
            <label className="text-white font-semibold mb-2 block flex items-center gap-2">
              <MapPin size={16} className="text-emerald-400" />
              {copy.form.location}
            </label>
            <input
              type="text"
              name="location"
              value={profileData.location}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-800/50 text-white focus:border-emerald-500 focus:outline-none transition-colors ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}
            />
          </div>

          <div>
            <label className="text-white font-semibold mb-2 block">{copy.form.bio}</label>
            <textarea
              name="bio"
              value={profileData.bio}
              onChange={handleInputChange}
              disabled={!isEditing}
              rows="4"
              className={`w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-800/50 text-white focus:border-emerald-500 focus:outline-none transition-colors resize-none ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}
            />
          </div>

          {isEditing && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold py-4 rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all flex items-center justify-center gap-2"
          >
            <Save size={20} />
            {copy.saveChanges}
          </motion.button>
        )}
      </div>
      </div>

      {/* Activity Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.03, y: -5 }}
          className="bg-slate-900/60 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6 text-center"
        >
          <Award className="w-12 h-12 mx-auto mb-4 text-emerald-400" />
          <h3 className="text-xl font-bold text-white mb-2">{copy.cards[0].title}</h3>
          <p className="text-slate-400">{copy.cards[0].description}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03, y: -5 }}
          className="bg-slate-900/60 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6 text-center"
        >
          <Heart className="w-12 h-12 mx-auto mb-4 text-red-400" />
          <h3 className="text-xl font-bold text-white mb-2">{copy.cards[1].title}</h3>
          <p className="text-slate-400">{copy.cards[1].description}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03, y: -5 }}
          className="bg-slate-900/60 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6 text-center"
        >
          <Share2 className="w-12 h-12 mx-auto mb-4 text-blue-400" />
          <h3 className="text-xl font-bold text-white mb-2">{copy.cards[2].title}</h3>
          <p className="text-slate-400">{copy.cards[2].description}</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
