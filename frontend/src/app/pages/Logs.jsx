import { motion } from 'motion/react';
import { Activity, Clock, User, MapPin, Filter, TrendingUp, TrendingDown } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedCopy } from '../lib/getLocalizedCopy';

const LOGS_COPY = {
  english: {
    title: 'Logs & Monitoring',
    subtitle: 'Track system activities and user interactions',
    stats: ['Total Activities', "Today's Logs", 'Active Users', 'Avg Response Time'],
    filters: {
      all: 'All Activities',
      recommendation: 'Recommendations',
      detection: 'Disease Detections',
      upload: 'Uploads',
      auth: 'Authentication',
      profile: 'Profile Changes',
    },
    entries: [
      { action: 'Crop Recommendation Generated', details: 'Rice recommendation for Punjab region' },
      { action: 'Disease Detection Completed', details: 'Late Blight detected in Tomato crop' },
      { action: 'Soil Report Uploaded', details: 'Lab report processed via OCR' },
      { action: 'User Login', details: 'Successful login from mobile app' },
      { action: 'Crop Recommendation Generated', details: 'Wheat recommendation for Rabi season' },
      { action: 'Disease Detection Completed', details: 'Powdery Mildew detected in Wheat' },
      { action: 'Profile Updated', details: 'Farm size and crop details modified' },
      { action: 'Crop Recommendation Generated', details: 'Cotton recommendation generated' },
    ],
    loadMore: 'Load More Logs',
  },
  hindi: {
    title: 'लॉग्स और मॉनिटरिंग',
    subtitle: 'सिस्टम गतिविधियों और उपयोगकर्ता इंटरैक्शन को ट्रैक करें',
    stats: ['कुल गतिविधियाँ', 'आज के लॉग्स', 'सक्रिय उपयोगकर्ता', 'औसत प्रतिक्रिया समय'],
    filters: {
      all: 'सभी गतिविधियाँ',
      recommendation: 'सिफारिशें',
      detection: 'रोग पहचान',
      upload: 'अपलोड',
      auth: 'प्रमाणीकरण',
      profile: 'प्रोफाइल परिवर्तन',
    },
    entries: [
      { action: 'फसल सिफारिश तैयार हुई', details: 'पंजाब क्षेत्र के लिए धान की सिफारिश' },
      { action: 'रोग पहचान पूर्ण हुई', details: 'टमाटर की फसल में लेट ब्लाइट पाया गया' },
      { action: 'मिट्टी रिपोर्ट अपलोड हुई', details: 'OCR के माध्यम से लैब रिपोर्ट प्रोसेस हुई' },
      { action: 'उपयोगकर्ता लॉगिन', details: 'मोबाइल ऐप से सफल लॉगिन' },
      { action: 'फसल सिफारिश तैयार हुई', details: 'रबी मौसम के लिए गेहूं की सिफारिश' },
      { action: 'रोग पहचान पूर्ण हुई', details: 'गेहूं में पाउडरी मिल्ड्यू पाया गया' },
      { action: 'प्रोफाइल अपडेट हुई', details: 'खेत का आकार और फसल विवरण बदला गया' },
      { action: 'फसल सिफारिश तैयार हुई', details: 'कपास की सिफारिश बनाई गई' },
    ],
    loadMore: 'और लॉग्स लोड करें',
  },
  gujarati: {
    title: 'લૉગ્સ અને મોનીટરીંગ',
    subtitle: 'સિસ્ટમ પ્રવૃત્તિઓ અને વપરાશકર્તા ક્રિયાઓને ટ્રેક કરો',
    stats: ['કુલ પ્રવૃત્તિઓ', 'આજના લૉગ્સ', 'સક્રિય વપરાશકર્તાઓ', 'સરેરાશ પ્રતિસાદ સમય'],
    filters: {
      all: 'બધી પ્રવૃત્તિઓ',
      recommendation: 'ભલામણો',
      detection: 'રોગ ઓળખ',
      upload: 'અપલોડ',
      auth: 'પ્રમાણીકરણ',
      profile: 'પ્રોફાઇલ ફેરફારો',
    },
    entries: [
      { action: 'પાક ભલામણ જનરેટ થઈ', details: 'પંજાબ માટે ચોખાની ભલામણ' },
      { action: 'રોગ ઓળખ પૂર્ણ થઈ', details: 'ટામેટા પાકમાં લેટ બ્લાઇટ મળ્યું' },
      { action: 'માટી રિપોર્ટ અપલોડ થયો', details: 'OCR દ્વારા લેબ રિપોર્ટ પ્રક્રિયા થયો' },
      { action: 'વપરાશકર્તા લોગિન', details: 'મોબાઇલ એપથી સફળ લોગિન' },
      { action: 'પાક ભલામણ જનરેટ થઈ', details: 'રબી સિઝન માટે ઘઉંની ભલામણ' },
      { action: 'રોગ ઓળખ પૂર્ણ થઈ', details: 'ઘઉંમાં પાઉડરી મિલ્ડ્યુ મળ્યું' },
      { action: 'પ્રોફાઇલ અપડેટ થઈ', details: 'ફાર્મ સાઈઝ અને પાક વિગતો સુધારાઈ' },
      { action: 'પાક ભલામણ જનરેટ થઈ', details: 'કપાસ માટે ભલામણ તૈયાર થઈ' },
    ],
    loadMore: 'વધુ લૉગ્સ લોડ કરો',
  },
};

const LOGS = [
  {
    id: 1,
    user: 'Rajesh Kumar',
    action: 'Crop Recommendation Generated',
    details: 'Rice recommendation for Punjab region',
    timestamp: '2026-03-22 14:30:25',
    location: 'Punjab',
    type: 'recommendation',
  },
  {
    id: 2,
    user: 'Priya Sharma',
    action: 'Disease Detection Completed',
    details: 'Late Blight detected in Tomato crop',
    timestamp: '2026-03-22 14:25:12',
    location: 'Maharashtra',
    type: 'detection',
  },
  {
    id: 3,
    user: 'Amit Patel',
    action: 'Soil Report Uploaded',
    details: 'Lab report processed via OCR',
    timestamp: '2026-03-22 14:18:45',
    location: 'Gujarat',
    type: 'upload',
  },
  {
    id: 4,
    user: 'Sunita Devi',
    action: 'User Login',
    details: 'Successful login from mobile app',
    timestamp: '2026-03-22 14:10:33',
    location: 'Haryana',
    type: 'auth',
  },
  {
    id: 5,
    user: 'Vijay Singh',
    action: 'Crop Recommendation Generated',
    details: 'Wheat recommendation for Rabi season',
    timestamp: '2026-03-22 14:05:19',
    location: 'Uttar Pradesh',
    type: 'recommendation',
  },
  {
    id: 6,
    user: 'Kavita Rao',
    action: 'Disease Detection Completed',
    details: 'Powdery Mildew detected in Wheat',
    timestamp: '2026-03-22 13:55:47',
    location: 'Karnataka',
    type: 'detection',
  },
  {
    id: 7,
    user: 'Ravi Verma',
    action: 'Profile Updated',
    details: 'Farm size and crop details modified',
    timestamp: '2026-03-22 13:42:11',
    location: 'Madhya Pradesh',
    type: 'profile',
  },
  {
    id: 8,
    user: 'Meena Kumari',
    action: 'Crop Recommendation Generated',
    details: 'Cotton recommendation generated',
    timestamp: '2026-03-22 13:30:55',
    location: 'Telangana',
    type: 'recommendation',
  },
];

const LOG_TYPES = [
  { value: 'all', label: 'All Activities', color: 'from-slate-500 to-slate-600' },
  { value: 'recommendation', label: 'Recommendations', color: 'from-emerald-500 to-green-500' },
  { value: 'detection', label: 'Disease Detections', color: 'from-purple-500 to-pink-500' },
  { value: 'upload', label: 'Uploads', color: 'from-blue-500 to-cyan-500' },
  { value: 'auth', label: 'Authentication', color: 'from-orange-500 to-amber-500' },
  { value: 'profile', label: 'Profile Changes', color: 'from-indigo-500 to-purple-500' },
];

function StatCard({ label, value, change, color }) {
  const isPositive = change.startsWith('+');

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -5 }}
      className="bg-slate-900/60 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6"
    >
      <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl mb-4`} />
      <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
      <div className="flex items-center justify-between">
        <p className="text-slate-400 text-sm">{label}</p>
        <span className={`text-sm font-semibold flex items-center gap-1`}>
          {isPositive ? (
            <TrendingUp size={14} className="text-emerald-400" />
          ) : (
            <TrendingDown size={14} className="text-red-400" />
          )}
          <span className={isPositive ? 'text-emerald-400' : 'text-red-400'}>
            {change}
          </span>
        </span>
      </div>
    </motion.div>
  );
}

export function Logs() {
  const { language } = useLanguage();
  const copy = getLocalizedCopy(language, LOGS_COPY);
  const [filterType, setFilterType] = useState('all');
  const localizedLogs = LOGS.map((log, index) => ({
    ...log,
    action: copy.entries[index]?.action || log.action,
    details: copy.entries[index]?.details || log.details,
  }));
  const logTypes = [
    { value: 'all', label: copy.filters.all, color: 'from-slate-500 to-slate-600' },
    { value: 'recommendation', label: copy.filters.recommendation, color: 'from-emerald-500 to-green-500' },
    { value: 'detection', label: copy.filters.detection, color: 'from-purple-500 to-pink-500' },
    { value: 'upload', label: copy.filters.upload, color: 'from-blue-500 to-cyan-500' },
    { value: 'auth', label: copy.filters.auth, color: 'from-orange-500 to-amber-500' },
    { value: 'profile', label: copy.filters.profile, color: 'from-indigo-500 to-purple-500' },
  ];

  const filteredLogs = filterType === 'all'
    ? localizedLogs
    : localizedLogs.filter(log => log.type === filterType);

  const getLogTypeColor = (type) => {
    const logType = logTypes.find(t => t.value === type);
    return logType?.color || 'from-slate-500 to-slate-600';
  };

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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          label={copy.stats[0]}
          value="15,234"
          change="+12.5%"
          color="from-blue-500 to-cyan-500"
        />
        <StatCard
          label={copy.stats[1]}
          value="1,847"
          change="+8.3%"
          color="from-emerald-500 to-green-500"
        />
        <StatCard
          label={copy.stats[2]}
          value="892"
          change="+5.7%"
          color="from-purple-500 to-pink-500"
        />
        <StatCard
          label={copy.stats[3]}
          value="1.2s"
          change="-3.2%"
          color="from-orange-500 to-amber-500"
        />
      </div>

      {/* Filter Tabs */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-2">
        <div className="flex flex-wrap gap-2">
          {logTypes.map((type) => (
            <motion.button
              key={type.value}
              onClick={() => setFilterType(type.value)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all relative ${
                filterType === type.value
                  ? 'text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {filterType === type.value && (
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${type.color} opacity-20 rounded-xl border border-white/20`}
                />
              )}
              <Filter size={16} className="relative z-10" />
              <span className="relative z-10">{type.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Logs Timeline */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-8">
        <div className="space-y-4">
          {filteredLogs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: 8, backgroundColor: 'rgba(16, 185, 129, 0.05)' }}
              className="relative flex gap-4 p-5 rounded-xl border border-slate-800 hover:border-emerald-500/30 transition-all"
            >
              {/* Timeline Dot */}
              <div className="relative flex-shrink-0">
                <div className={`w-12 h-12 bg-gradient-to-br ${getLogTypeColor(log.type)} rounded-full flex items-center justify-center`}>
                  <Activity className="text-white" size={20} />
                </div>
                {index < filteredLogs.length - 1 && (
                  <div className="absolute top-12 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-slate-800" />
                )}
              </div>

              {/* Log Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-white font-bold mb-1">{log.action}</h3>
                    <p className="text-slate-400 text-sm">{log.details}</p>
                  </div>
                  <div className={`px-3 py-1 bg-gradient-to-r ${getLogTypeColor(log.type)} bg-opacity-20 rounded-full text-xs font-semibold text-white`}>
                    {log.type}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-3">
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <User size={14} className="text-emerald-400" />
                    <span>{log.user}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <MapPin size={14} className="text-blue-400" />
                    <span>{log.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Clock size={14} className="text-purple-400" />
                    <span>{log.timestamp}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Load More */}
      <div className="text-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-slate-800 border border-slate-700 text-white px-8 py-3 rounded-xl hover:bg-slate-700 transition-colors font-semibold"
        >
          {copy.loadMore}
        </motion.button>
      </div>
    </motion.div>
  );
}
