import { useState } from 'react';
import { motion } from 'motion/react';
import { Bell, Lock, Eye, Database, Zap, Moon, Globe, Shield, Save } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedCopy } from '../lib/getLocalizedCopy';

const ADMIN_SETTINGS_COPY = {
  english: {
    title: 'Admin Settings',
    subtitle: 'Manage system preferences and security settings',
    notifications: {
      title: 'Notifications',
      emailNotifications: 'Email Notifications',
      emailDescription: 'Receive alerts via email',
      pushNotifications: 'Push Notifications',
      pushDescription: 'Receive push alerts',
      digestFrequency: 'Email Digest Frequency',
      digestOptions: { hourly: 'Hourly', daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly' },
    },
    security: {
      title: 'Security',
      twoFactor: 'Two-Factor Authentication',
      twoFactorDescription: 'Enable 2FA for account security',
      changePassword: 'Change Password',
      changePasswordDescription: 'Update your password regularly',
      changeButton: 'Change',
      autoBackup: 'Auto Backup',
      autoBackupDescription: 'Automatically backup system data',
    },
    system: {
      title: 'System Settings',
      theme: 'Theme',
      language: 'Language',
      timezone: 'Timezone',
      darkMode: 'Dark Mode',
      lightMode: 'Light Mode',
    },
    data: {
      title: 'Data Management',
      retention: 'Data Retention (Days)',
      retentionDescription: 'How long to keep old records (0 = indefinite)',
      apiLimit: 'API Rate Limit (req/hour)',
    },
    save: 'Save Settings',
    languages: { english: 'English', hindi: 'Hindi', gujarati: 'Gujarati' },
  },
  hindi: {
    title: 'एडमिन सेटिंग्स',
    subtitle: 'सिस्टम प्राथमिकताओं और सुरक्षा सेटिंग्स का प्रबंधन करें',
    notifications: {
      title: 'सूचनाएँ',
      emailNotifications: 'ईमेल सूचनाएँ',
      emailDescription: 'ईमेल द्वारा अलर्ट प्राप्त करें',
      pushNotifications: 'पुश सूचनाएँ',
      pushDescription: 'पुश अलर्ट प्राप्त करें',
      digestFrequency: 'ईमेल डाइजेस्ट आवृत्ति',
      digestOptions: { hourly: 'हर घंटे', daily: 'दैनिक', weekly: 'साप्ताहिक', monthly: 'मासिक' },
    },
    security: {
      title: 'सुरक्षा',
      twoFactor: 'दो-स्तरीय प्रमाणीकरण',
      twoFactorDescription: 'खाते की सुरक्षा के लिए 2FA सक्षम करें',
      changePassword: 'पासवर्ड बदलें',
      changePasswordDescription: 'अपना पासवर्ड नियमित रूप से अपडेट करें',
      changeButton: 'बदलें',
      autoBackup: 'ऑटो बैकअप',
      autoBackupDescription: 'सिस्टम डेटा का स्वचालित बैकअप लें',
    },
    system: {
      title: 'सिस्टम सेटिंग्स',
      theme: 'थीम',
      language: 'भाषा',
      timezone: 'समय क्षेत्र',
      darkMode: 'डार्क मोड',
      lightMode: 'लाइट मोड',
    },
    data: {
      title: 'डेटा प्रबंधन',
      retention: 'डेटा संरक्षण (दिन)',
      retentionDescription: 'पुराने रिकॉर्ड कितने समय तक रखें (0 = अनिश्चित)',
      apiLimit: 'API दर सीमा (req/hour)',
    },
    save: 'सेटिंग्स सहेजें',
    languages: { english: 'अंग्रेज़ी', hindi: 'हिन्दी', gujarati: 'गुजराती' },
  },
  gujarati: {
    title: 'એડમિન સેટિંગ્સ',
    subtitle: 'સિસ્ટમ પસંદગીઓ અને સુરક્ષા સેટિંગ્સનું સંચાલન કરો',
    notifications: {
      title: 'સૂચનાઓ',
      emailNotifications: 'ઇમેઇલ સૂચનાઓ',
      emailDescription: 'ઇમેઇલ દ્વારા એલર્ટ મેળવો',
      pushNotifications: 'પુશ સૂચનાઓ',
      pushDescription: 'પુશ એલર્ટ મેળવો',
      digestFrequency: 'ઇમેઇલ ડાઇજેસ્ટ આવર્તન',
      digestOptions: { hourly: 'દર કલાકે', daily: 'દૈનિક', weekly: 'સાપ્તાહિક', monthly: 'માસિક' },
    },
    security: {
      title: 'સુરક્ષા',
      twoFactor: 'ટુ-ફેક્ટર ઓથેન્ટિકેશન',
      twoFactorDescription: 'એકાઉન્ટ સુરક્ષા માટે 2FA સક્રિય કરો',
      changePassword: 'પાસવર્ડ બદલો',
      changePasswordDescription: 'પાસવર્ડ નિયમિત રીતે અપડેટ કરો',
      changeButton: 'બદલો',
      autoBackup: 'ઓટો બેકઅપ',
      autoBackupDescription: 'સિસ્ટમ ડેટાનો આપમેળે બેકઅપ લો',
    },
    system: {
      title: 'સિસ્ટમ સેટિંગ્સ',
      theme: 'થીમ',
      language: 'ભાષા',
      timezone: 'સમય ઝોન',
      darkMode: 'ડાર્ક મોડ',
      lightMode: 'લાઇટ મોડ',
    },
    data: {
      title: 'ડેટા મેનેજમેન્ટ',
      retention: 'ડેટા રિટેન્શન (દિવસ)',
      retentionDescription: 'જૂના રેકોર્ડ કેટલા દિવસ રાખવા (0 = અમર્યાદિત)',
      apiLimit: 'API રેટ લિમિટ (req/hour)',
    },
    save: 'સેટિંગ્સ સાચવો',
    languages: { english: 'અંગ્રેજી', hindi: 'હિન્દી', gujarati: 'ગુજરાતી' },
  },
};

export function AdminSettings() {
  const { theme, toggleTheme } = useTheme();
  const { language, changeLanguage } = useLanguage();
  const copy = getLocalizedCopy(language, ADMIN_SETTINGS_COPY);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    twoFactor: true,
    emailDigest: 'daily',
    autoBackup: true,
    dataRetention: '90',
    apiLimit: '1000',
    timezone: 'IST (UTC+5:30)',
  });

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'language') {
      console.log('Changing language to:', value);
      changeLanguage(value);
    } else {
      setSettings(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSave = () => {
    console.log('Settings saved:', settings);
  };

  const SettingRow = ({ icon: Icon, title, description, control }) => (
    <motion.div
      whileHover={{ backgroundColor: 'rgba(16, 185, 129, 0.02)' }}
      className="flex items-center justify-between p-4 rounded-xl border border-slate-800 hover:border-emerald-500/30 transition-all"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
          <Icon className="text-emerald-400" size={20} />
        </div>
        <div>
          <h3 className="text-white font-semibold">{title}</h3>
          <p className="text-slate-400 text-sm">{description}</p>
        </div>
      </div>
      {control}
    </motion.div>
  );

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

      {/* Notifications Section */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Bell className="text-emerald-400" size={24} />
          {copy.notifications.title}
        </h2>

        <div className="space-y-4">
          <SettingRow
            icon={Bell}
            title={copy.notifications.emailNotifications}
            description={copy.notifications.emailDescription}
            control={
              <label className="relative cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={() => handleToggle('emailNotifications')}
                  className="sr-only"
                />
                <div className={`w-14 h-8 rounded-full transition-colors ${settings.emailNotifications ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${settings.emailNotifications ? 'translate-x-6' : ''}`} />
              </label>
            }
          />

          <SettingRow
            icon={Bell}
            title={copy.notifications.pushNotifications}
            description={copy.notifications.pushDescription}
            control={
              <label className="relative cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.pushNotifications}
                  onChange={() => handleToggle('pushNotifications')}
                  className="sr-only"
                />
                <div className={`w-14 h-8 rounded-full transition-colors ${settings.pushNotifications ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${settings.pushNotifications ? 'translate-x-6' : ''}`} />
              </label>
            }
          />

          <div className="mt-6 p-4 rounded-xl border border-slate-700 bg-slate-800/30">
            <label className="text-white font-semibold mb-3 block">{copy.notifications.digestFrequency}</label>
            <select
              name="emailDigest"
              value={settings.emailDigest}
              onChange={handleChange}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:outline-none transition-colors"
            >
              <option value="hourly">{copy.notifications.digestOptions.hourly}</option>
              <option value="daily">{copy.notifications.digestOptions.daily}</option>
              <option value="weekly">{copy.notifications.digestOptions.weekly}</option>
              <option value="monthly">{copy.notifications.digestOptions.monthly}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Shield className="text-red-400" size={24} />
          {copy.security.title}
        </h2>

        <div className="space-y-4">
          <SettingRow
            icon={Lock}
            title={copy.security.twoFactor}
            description={copy.security.twoFactorDescription}
            control={
              <label className="relative cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.twoFactor}
                  onChange={() => handleToggle('twoFactor')}
                  className="sr-only"
                />
                <div className={`w-14 h-8 rounded-full transition-colors ${settings.twoFactor ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${settings.twoFactor ? 'translate-x-6' : ''}`} />
              </label>
            }
          />

          <motion.div
            whileHover={{ backgroundColor: 'rgba(16, 185, 129, 0.02)' }}
            className="p-4 rounded-xl border border-slate-800 hover:border-emerald-500/30 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Eye className="text-blue-400" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold">{copy.security.changePassword}</h3>
                <p className="text-slate-400 text-sm">{copy.security.changePasswordDescription}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                {copy.security.changeButton}
              </motion.button>
            </div>
          </motion.div>

          <SettingRow
            icon={Shield}
            title={copy.security.autoBackup}
            description={copy.security.autoBackupDescription}
            control={
              <label className="relative cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoBackup}
                  onChange={() => handleToggle('autoBackup')}
                  className="sr-only"
                />
                <div className={`w-14 h-8 rounded-full transition-colors ${settings.autoBackup ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${settings.autoBackup ? 'translate-x-6' : ''}`} />
              </label>
            }
          />
        </div>
      </div>

      {/* System Settings Section */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Zap className="text-yellow-400" size={24} />
          {copy.system.title}
        </h2>

        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-slate-700 bg-slate-800/30">
            <label className="text-white font-semibold mb-3 block flex items-center gap-2">
              <Moon className="text-purple-400" size={18} />
              {copy.system.theme}
            </label>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">
                {theme === 'dark' ? copy.system.darkMode : copy.system.lightMode}
              </span>
              <button
                onClick={() => {
                  console.log('Theme button clicked, current theme:', theme);
                  toggleTheme();
                }}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  theme === 'dark' ? 'bg-emerald-500' : 'bg-slate-600'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    theme === 'dark' ? 'translate-x-6' : ''
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-700 bg-slate-800/30">
            <label className="text-white font-semibold mb-3 block flex items-center gap-2">
              <Globe className="text-blue-400" size={18} />
              {copy.system.language}
            </label>
            <select
              name="language"
              value={language}
              onChange={handleChange}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:outline-none transition-colors"
            >
              <option value="english">{copy.languages.english}</option>
              <option value="hindi">{copy.languages.hindi}</option>
              <option value="gujarati">{copy.languages.gujarati}</option>
            </select>
          </div>

          <div className="p-4 rounded-xl border border-slate-700 bg-slate-800/30">
            <label className="text-white font-semibold mb-3 block flex items-center gap-2">
              <Globe className="text-purple-400" size={18} />
              {copy.system.timezone}
            </label>
            <select
              name="timezone"
              value={settings.timezone}
              onChange={handleChange}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:outline-none transition-colors"
            >
              <option value="IST (UTC+5:30)">IST (UTC+5:30)</option>
              <option value="GMT (UTC+0)">GMT (UTC+0)</option>
              <option value="EST (UTC-5)">EST (UTC-5)</option>
              <option value="PST (UTC-8)">PST (UTC-8)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Management Section */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Database className="text-cyan-400" size={24} />
          {copy.data.title}
        </h2>

        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-slate-700 bg-slate-800/30">
            <label className="text-white font-semibold mb-3 block">{copy.data.retention}</label>
            <input
              type="number"
              name="dataRetention"
              value={settings.dataRetention}
              onChange={handleChange}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:outline-none transition-colors"
            />
            <p className="text-slate-400 text-sm mt-2">{copy.data.retentionDescription}</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-700 bg-slate-800/30">
            <label className="text-white font-semibold mb-3 block">{copy.data.apiLimit}</label>
            <input
              type="number"
              name="apiLimit"
              value={settings.apiLimit}
              onChange={handleChange}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSave}
        className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold py-4 rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all flex items-center justify-center gap-2"
      >
        <Save size={20} />
        {copy.save}
      </motion.button>
    </motion.div>
  );
}
