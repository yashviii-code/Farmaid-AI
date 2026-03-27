import { motion } from 'motion/react';
import { Users, Sprout, Activity, TrendingUp, Scan, MapPin, Cloud, Droplets } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedCopy } from '../lib/getLocalizedCopy';

const ADMIN_DASHBOARD_COPY = {
  english: {
    title: 'Dashboard',
    subtitle: "Welcome back! Here's what's happening with your farm network.",
    stats: ['Total Farmers', 'Crop Recommendations', 'Disease Detections', 'System Usage'],
    charts: {
      activityOverview: 'Activity Overview',
      cropDistribution: 'Crop Distribution',
      recommendations: 'Recommendations',
      detections: 'Detections',
    },
    recent: {
      title: 'Recent Activities',
      viewAll: 'View All',
      entries: [
        { action: 'Crop recommendation for Rice', time: '2 mins ago' },
        { action: 'Disease detection - Leaf Blight', time: '5 mins ago' },
        { action: 'Soil report uploaded', time: '12 mins ago' },
        { action: 'Crop recommendation for Wheat', time: '18 mins ago' },
        { action: 'Disease detection - Powdery Mildew', time: '25 mins ago' },
      ],
    },
    weather: {
      title: 'Weather Insights',
      temperature: 'Temperature',
      humidity: 'Humidity',
      rainfall: 'Rainfall (7d)',
    },
    insights: {
      title: 'AI Insights',
      items: [
        '🌾 Optimal planting season for Rice in Punjab region starting next week.',
        '⚠️ Increased disease detection alerts in Maharashtra - Monitor leaf health.',
        '📈 Crop recommendation requests up 15% this month.',
      ],
    },
  },
  hindi: {
    title: 'डैशबोर्ड',
    subtitle: 'फिर से स्वागत है! आपके फार्म नेटवर्क में क्या हो रहा है, यह देखें।',
    stats: ['कुल किसान', 'फसल सिफारिशें', 'रोग पहचान', 'सिस्टम उपयोग'],
    charts: {
      activityOverview: 'गतिविधि अवलोकन',
      cropDistribution: 'फसल वितरण',
      recommendations: 'सिफारिशें',
      detections: 'पहचान',
    },
    recent: {
      title: 'हाल की गतिविधियाँ',
      viewAll: 'सभी देखें',
      entries: [
        { action: 'धान के लिए फसल सिफारिश', time: '2 मिनट पहले' },
        { action: 'रोग पहचान - लीफ ब्लाइट', time: '5 मिनट पहले' },
        { action: 'मिट्टी की रिपोर्ट अपलोड हुई', time: '12 मिनट पहले' },
        { action: 'गेहूं के लिए फसल सिफारिश', time: '18 मिनट पहले' },
        { action: 'रोग पहचान - पाउडरी मिल्ड्यू', time: '25 मिनट पहले' },
      ],
    },
    weather: {
      title: 'मौसम जानकारी',
      temperature: 'तापमान',
      humidity: 'आर्द्रता',
      rainfall: 'वर्षा (7 दिन)',
    },
    insights: {
      title: 'एआई इनसाइट्स',
      items: [
        '🌾 पंजाब क्षेत्र में धान के लिए अनुकूल बुवाई मौसम अगले सप्ताह से शुरू हो रहा है।',
        '⚠️ महाराष्ट्र में रोग पहचान अलर्ट बढ़े हैं - पत्तियों के स्वास्थ्य पर नजर रखें।',
        '📈 इस महीने फसल सिफारिश अनुरोध 15% बढ़े हैं।',
      ],
    },
  },
  gujarati: {
    title: 'ડેશબોર્ડ',
    subtitle: 'ફરીથી સ્વાગત છે! તમારા ફાર્મ નેટવર્કમાં શું થઈ રહ્યું છે તે જુઓ.',
    stats: ['કુલ ખેડૂત', 'પાક ભલામણો', 'રોગ ઓળખ', 'સિસ્ટમ ઉપયોગ'],
    charts: {
      activityOverview: 'પ્રવૃત્તિ સમીક્ષા',
      cropDistribution: 'પાક વિતરણ',
      recommendations: 'ભલામણો',
      detections: 'ઓળખ',
    },
    recent: {
      title: 'તાજેતરની પ્રવૃત્તિઓ',
      viewAll: 'બધું જુઓ',
      entries: [
        { action: 'ચોખા માટે પાક ભલામણ', time: '2 મિનિટ પહેલા' },
        { action: 'રોગ ઓળખ - લીફ બ્લાઇટ', time: '5 મિનિટ પહેલા' },
        { action: 'માટી રિપોર્ટ અપલોડ થયો', time: '12 મિનિટ પહેલા' },
        { action: 'ઘઉં માટે પાક ભલામણ', time: '18 મિનિટ પહેલા' },
        { action: 'રોગ ઓળખ - પાઉડરી મિલ્ડ્યુ', time: '25 મિનિટ પહેલા' },
      ],
    },
    weather: {
      title: 'હવામાન માહિતી',
      temperature: 'તાપમાન',
      humidity: 'ભેજ',
      rainfall: 'વરસાદ (7 દિવસ)',
    },
    insights: {
      title: 'એઆઇ ઇન્સાઇટ્સ',
      items: [
        '🌾 પંજાબ વિસ્તારમાં ચોખા માટે ઉત્તમ વાવેતર સીઝન આવતા અઠવાડિયાથી શરૂ થાય છે.',
        '⚠️ મહારાષ્ટ્રમાં રોગ ઓળખ એલર્ટ વધ્યા છે - પાંદડાના આરોગ્ય પર નજર રાખો.',
        '📈 આ મહિને પાક ભલામણ વિનંતીઓ 15% વધી છે.',
      ],
    },
  },
};

const cropData = [
  { month: 'Jan', recommendations: 1200, detections: 400 },
  { month: 'Feb', recommendations: 1900, detections: 600 },
  { month: 'Mar', recommendations: 2200, detections: 750 },
  { month: 'Apr', recommendations: 2800, detections: 820 },
  { month: 'May', recommendations: 3100, detections: 950 },
  { month: 'Jun', recommendations: 2600, detections: 680 },
];

const cropDistribution = [
  { name: 'Rice', value: 35, color: '#10b981' },
  { name: 'Wheat', value: 25, color: '#f59e0b' },
  { name: 'Cotton', value: 20, color: '#8b5cf6' },
  { name: 'Maize', value: 15, color: '#3b82f6' },
  { name: 'Others', value: 5, color: '#6b7280' },
];

const recentActivities = [
  { user: 'Rajesh Kumar', action: 'Crop recommendation for Rice', location: 'Punjab', time: '2 mins ago' },
  { user: 'Priya Sharma', action: 'Disease detection - Leaf Blight', location: 'Maharashtra', time: '5 mins ago' },
  { user: 'Amit Patel', action: 'Soil report uploaded', location: 'Gujarat', time: '12 mins ago' },
  { user: 'Sunita Devi', action: 'Crop recommendation for Wheat', location: 'Haryana', time: '18 mins ago' },
  { user: 'Vijay Singh', action: 'Disease detection - Powdery Mildew', location: 'Uttar Pradesh', time: '25 mins ago' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  },
};

export function AdminDashboard() {
  const { language } = useLanguage();
  const copy = getLocalizedCopy(language, ADMIN_DASHBOARD_COPY);
  const statsData = [
    { icon: Users, label: copy.stats[0], value: '2,847', change: '+12.5%', color: 'from-blue-500 to-cyan-500' },
    { icon: Sprout, label: copy.stats[1], value: '15,234', change: '+8.2%', color: 'from-emerald-500 to-green-500' },
    { icon: Scan, label: copy.stats[2], value: '4,892', change: '+15.7%', color: 'from-purple-500 to-pink-500' },
    { icon: Activity, label: copy.stats[3], value: '89.4%', change: '+5.3%', color: 'from-orange-500 to-amber-500' },
  ];
  const localizedActivities = recentActivities.map((activity, index) => ({
    ...activity,
    action: copy.recent.entries[index]?.action || activity.action,
    time: copy.recent.entries[index]?.time || activity.time,
  }));

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-4xl font-bold text-white mb-2">{copy.title}</h1>
        <p className="text-emerald-400">{copy.subtitle}</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.03, y: -5 }}
              className="relative bg-slate-900/60 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6 overflow-hidden group"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <span className="text-emerald-400 text-sm font-semibold">{stat.change}</span>
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-slate-400 text-sm">{stat.label}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 bg-slate-900/60 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-6">{copy.charts.activityOverview}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={cropData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #10b981',
                  borderRadius: '12px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="recommendations"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 6 }}
                name={copy.charts.recommendations}
              />
              <Line
                type="monotone"
                dataKey="detections"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', r: 6 }}
                name={copy.charts.detections}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Crop Distribution */}
        <motion.div
          variants={itemVariants}
          className="bg-slate-900/60 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-6">{copy.charts.cropDistribution}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={cropDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {cropDistribution.map((entry, index) => (
                  <Cell key={`crop-cell-${entry.name}-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #10b981',
                  borderRadius: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Activities */}
      <motion.div
        variants={itemVariants}
        className="bg-slate-900/60 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">{copy.recent.title}</h2>
          <button className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors">
            {copy.recent.viewAll}
          </button>
        </div>

        <div className="space-y-4">
          {localizedActivities.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 8, backgroundColor: 'rgba(16, 185, 129, 0.05)' }}
              className="flex items-center gap-4 p-4 rounded-xl border border-slate-800 hover:border-emerald-500/30 transition-all"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">
                  {activity.user.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{activity.user}</p>
                <p className="text-slate-400 text-sm truncate">{activity.action}</p>
              </div>
              
              <div className="flex items-center gap-2 text-slate-400 text-sm flex-shrink-0">
                <MapPin size={14} className="text-emerald-400" />
                <span className="hidden sm:inline">{activity.location}</span>
              </div>
              
              <span className="text-slate-500 text-xs flex-shrink-0">{activity.time}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Weather & Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">{copy.weather.title}</h2>
            <Cloud className="text-blue-400" size={32} />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">{copy.weather.temperature}</span>
              <span className="text-white font-bold text-xl">28°C</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">{copy.weather.humidity}</span>
              <span className="text-white font-bold text-xl">65%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">{copy.weather.rainfall}</span>
              <span className="text-white font-bold text-xl">45mm</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-emerald-900/40 to-green-900/40 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">{copy.insights.title}</h2>
            <TrendingUp className="text-emerald-400" size={32} />
          </div>
          <div className="space-y-3">
            {copy.insights.items.map((insight) => (
              <p key={insight} className="text-slate-300 text-sm leading-relaxed">
                {insight}
              </p>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
