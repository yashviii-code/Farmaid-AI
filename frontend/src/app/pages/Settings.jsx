import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Globe, Bell, Palette, Shield, Database, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { getLocalizedCopy } from "../lib/getLocalizedCopy";

const SETTINGS_COPY = {
  english: {
    back: "Back",
    title: "Settings",
    subtitle: "Configure your system preferences",
    sections: {
      language: { title: "Language & Region", description: "Choose your preferred language" },
      notifications: { title: "Notifications", description: "Manage notification preferences", toggle: "Enable Notifications" },
      appearance: { title: "Appearance", description: "Customize the look and feel", darkMode: "Dark Mode" },
      security: { title: "Security", description: "Manage security preferences", changePassword: "Change Password", enable2fa: "Enable 2FA", enabled2fa: "2FA Enabled" },
      data: { title: "Data Management", description: "Backup and restore settings", automaticBackups: "Automatic Backups", downloadBackup: "Download Backup" },
      performance: { title: "Performance", description: "Optimize system performance", cacheSize: "Cache Size", clearCache: "Clear Cache" },
    },
    buttons: { saveAll: "Save All Changes" },
    languages: { english: "English", hindi: "Hindi", gujarati: "Gujarati" },
  },
  hindi: {
    back: "वापस",
    title: "सेटिंग्स",
    subtitle: "अपनी सिस्टम प्राथमिकताओं को कॉन्फ़िगर करें",
    sections: {
      language: { title: "भाषा और क्षेत्र", description: "अपनी पसंदीदा भाषा चुनें" },
      notifications: { title: "सूचनाएँ", description: "सूचना प्राथमिकताओं का प्रबंधन करें", toggle: "सूचनाएँ सक्षम करें" },
      appearance: { title: "दिखावट", description: "रूप और अनुभव को अनुकूलित करें", darkMode: "डार्क मोड" },
      security: { title: "सुरक्षा", description: "सुरक्षा प्राथमिकताओं का प्रबंधन करें", changePassword: "पासवर्ड बदलें", enable2fa: "2FA सक्षम करें", enabled2fa: "2FA सक्षम है" },
      data: { title: "डेटा प्रबंधन", description: "बैकअप और रिस्टोर सेटिंग्स", automaticBackups: "स्वचालित बैकअप", downloadBackup: "बैकअप डाउनलोड करें" },
      performance: { title: "प्रदर्शन", description: "सिस्टम प्रदर्शन को बेहतर बनाएं", cacheSize: "कैश आकार", clearCache: "कैश साफ करें" },
    },
    buttons: { saveAll: "सभी परिवर्तन सहेजें" },
    languages: { english: "अंग्रेज़ी", hindi: "हिन्दी", gujarati: "गुजराती" },
  },
  gujarati: {
    back: "પાછા",
    title: "સેટિંગ્સ",
    subtitle: "તમારી સિસ્ટમ પસંદગીઓ ગોઠવો",
    sections: {
      language: { title: "ભાષા અને વિસ્તાર", description: "તમારી પસંદગીની ભાષા પસંદ કરો" },
      notifications: { title: "સૂચનાઓ", description: "સૂચના પસંદગીઓ સંચાલિત કરો", toggle: "સૂચનાઓ સક્રિય કરો" },
      appearance: { title: "દેખાવ", description: "દેખાવ અને અનુભવને કસ્ટમાઇઝ કરો", darkMode: "ડાર્ક મોડ" },
      security: { title: "સુરક્ષા", description: "સુરક્ષા પસંદગીઓ સંચાલિત કરો", changePassword: "પાસવર્ડ બદલો", enable2fa: "2FA સક્રિય કરો", enabled2fa: "2FA સક્રિય છે" },
      data: { title: "ડેટા મેનેજમેન્ટ", description: "બેકઅપ અને રીસ્ટોર સેટિંગ્સ", automaticBackups: "આપમેળે બેકઅપ", downloadBackup: "બેકઅપ ડાઉનલોડ કરો" },
      performance: { title: "પ્રદર્શન", description: "સિસ્ટમ પ્રદર્શન સુધારો", cacheSize: "કૅશ સાઈઝ", clearCache: "કૅશ સાફ કરો" },
    },
    buttons: { saveAll: "બધા ફેરફારો સાચવો" },
    languages: { english: "અંગ્રેજી", hindi: "હિન્દી", gujarati: "ગુજરાતી" },
  },
};

export function Settings() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { language, changeLanguage } = useLanguage();
  const copy = getLocalizedCopy(language, SETTINGS_COPY);
  const [settings, setSettings] = useState({
    notifications: true,
    twoFactor: false,
    automaticBackups: true,
    cacheSize: "256 MB",
  });

  const [changesMade, setChangesMade] = useState(false);

  const handleToggle = (key) => {
    if (key === "darkMode") {
      toggleTheme();
    } else {
      setSettings((prev) => {
        const currentValue = prev[key];
        if (typeof currentValue === "boolean") {
          return { ...prev, [key]: !currentValue };
        }
        return prev;
      });
    }
    setChangesMade(true);
  };

  const handleLanguageChange = (newLanguage) => {
    console.log('Farmer Settings: Changing language to:', newLanguage);
    changeLanguage(newLanguage);
    setChangesMade(true);
  };

  const handleSaveChanges = () => {
    setChangesMade(false);
    console.log("Settings saved:", settings);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-950 to-slate-950 text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-green-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <nav className="relative z-10 bg-slate-950/80 backdrop-blur-xl border-b border-green-500/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{copy.back}</span>
            </button>
            <h1 className="text-2xl font-bold">{copy.title}</h1>
            <div className="w-24" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-gray-400 mb-8 text-center">{copy.subtitle}</p>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Language & Region */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800/50 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6 hover:border-green-500/40 transition-all"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-full p-3">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{copy.sections.language.title}</h3>
                <p className="text-sm text-gray-400">{copy.sections.language.description}</p>
              </div>
            </div>
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="w-full bg-slate-700/50 border border-green-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors"
            >
              <option value="english">{copy.languages.english}</option>
              <option value="hindi">{copy.languages.hindi}</option>
              <option value="gujarati">{copy.languages.gujarati}</option>
            </select>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/50 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6 hover:border-green-500/40 transition-all"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-full p-3">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{copy.sections.notifications.title}</h3>
                <p className="text-sm text-gray-400">{copy.sections.notifications.description}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">{copy.sections.notifications.toggle}</span>
              <button
                onClick={() => handleToggle("notifications")}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  settings.notifications ? "bg-green-500" : "bg-gray-600"
                }`}
              >
                <div
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    settings.notifications ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </motion.div>

          {/* Appearance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800/50 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6 hover:border-green-500/40 transition-all"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-full p-3">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{copy.sections.appearance.title}</h3>
                <p className="text-sm text-gray-400">{copy.sections.appearance.description}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">{copy.sections.appearance.darkMode}</span>
              <button
                onClick={() => {
                  console.log('Farmer theme button clicked, current theme:', theme);
                  handleToggle("darkMode");
                }}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  theme === "dark" ? "bg-green-500" : "bg-gray-600"
                }`}
              >
                <div
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    theme === "dark" ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </motion.div>

          {/* Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-800/50 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6 hover:border-green-500/40 transition-all"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-full p-3">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{copy.sections.security.title}</h3>
                <p className="text-sm text-gray-400">{copy.sections.security.description}</p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button className="w-full bg-slate-700/50 border border-green-500/30 hover:border-green-500 text-white font-medium py-3 rounded-lg transition-all hover:bg-slate-700">
                {copy.sections.security.changePassword}
              </button>
              <button
                onClick={() => handleToggle("twoFactor")}
                className={`w-full font-medium py-3 rounded-lg transition-all ${
                  settings.twoFactor
                    ? "bg-green-500/20 border border-green-500 text-green-300"
                    : "bg-slate-700/50 border border-green-500/30 text-white hover:border-green-500 hover:bg-slate-700"
                }`}
              >
                {settings.twoFactor ? copy.sections.security.enabled2fa : copy.sections.security.enable2fa}
              </button>
            </div>
          </motion.div>

          {/* Data Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-slate-800/50 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6 hover:border-green-500/40 transition-all"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-full p-3">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{copy.sections.data.title}</h3>
                <p className="text-sm text-gray-400">{copy.sections.data.description}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-white font-medium">{copy.sections.data.automaticBackups}</span>
              <button
                onClick={() => handleToggle("automaticBackups")}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  settings.automaticBackups ? "bg-green-500" : "bg-gray-600"
                }`}
              >
                <div
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    settings.automaticBackups ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <button className="w-full bg-blue-600/20 border border-blue-500/50 hover:border-blue-500 hover:bg-blue-600/30 text-blue-300 font-medium py-3 rounded-lg transition-all">
              {copy.sections.data.downloadBackup}
            </button>
          </motion.div>

          {/* Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-slate-800/50 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6 hover:border-green-500/40 transition-all"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-full p-3">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{copy.sections.performance.title}</h3>
                <p className="text-sm text-gray-400">{copy.sections.performance.description}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-white font-medium">{copy.sections.performance.cacheSize}</span>
              <span className="text-green-400 font-semibold">{settings.cacheSize}</span>
            </div>
            <button className="w-full bg-slate-700/50 border border-red-500/30 hover:border-red-500 text-red-400 font-medium py-3 rounded-lg transition-all hover:bg-red-500/10">
              {copy.sections.performance.clearCache}
            </button>
          </motion.div>
        </div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex justify-center"
        >
          <button
            onClick={handleSaveChanges}
            disabled={!changesMade}
            className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 active:scale-95 ${
              changesMade
                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg hover:shadow-green-500/50"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
          >
            {copy.buttons.saveAll}
          </button>
        </motion.div>
      </main>
    </div>
  );
}
