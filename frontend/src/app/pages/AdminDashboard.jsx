import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Activity, Cloud, MapPin, Scan, Sprout, TrendingUp, Users } from "lucide-react";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useLanguage } from "../context/LanguageContext";
import { getLocalizedCopy } from "../lib/getLocalizedCopy";
import {
  getAdminRecentActivities,
  getDashboardAnalytics,
  getDashboardCropDistribution,
  getDashboardStats,
} from "../api/dashboard.api";
import { getCurrentLocationWeather } from "../api/location.api";

const ADMIN_DASHBOARD_COPY = {
  english: {
    title: "Dashboard",
    subtitle: "Live insights from your FarmAid network.",
    stats: {
      totalFarmers: "Total Farmers",
      totalCropPredictions: "Crop Recommendations",
      totalDiseaseDetections: "Disease Detections",
      systemUsage: "System Usage",
    },
    cards: {
      farmersHint: "Registered farmer accounts",
      cropHint: "Total recommendation requests",
      diseaseHint: "Total disease scans completed",
      usageHint: "Active farmer usage in the last 30 days",
    },
    charts: {
      activityOverview: "Activity Overview",
      cropDistribution: "Crop Distribution",
      recommendations: "Recommendations",
      detections: "Detections",
      noChartData: "No analytics data available yet.",
      noCropData: "No crop distribution data available yet.",
    },
    recent: {
      title: "Recent Activities",
      viewAll: "Latest 5",
      empty: "No recent activities found yet.",
      loading: "Loading recent activities...",
      userFallback: "Unknown User",
    },
    weather: {
      title: "Weather Insights",
      temperature: "Temperature",
      humidity: "Humidity",
      rainfall: "Rainfall",
      location: "Detected Location",
      loading: "Detecting weather from your current location...",
      denied: "Location access denied. Weather insights unavailable.",
      unavailable: "Weather insights are currently unavailable.",
      unsupported: "Geolocation is not supported in this browser.",
    },
    insights: {
      title: "AI Insights",
      empty: "Insights will appear as soon as enough dashboard data is available.",
      cropIncrease: "Crop recommendation requests increased by {percent}% compared to last month.",
      cropDecrease: "Crop recommendation requests dropped by {percent}% compared to last month.",
      diseaseHigh: "Disease detection volume is elevated this month. Consider proactive farmer alerts.",
      diseaseStable: "Disease detection volume looks stable compared to recent months.",
      topCrop: "{crop} is the leading recommended crop in the current data.",
      usageHigh: "System usage is healthy, with strong recent farmer engagement.",
      usageLow: "System usage is still low. Encouraging more farmer sign-ins could improve adoption.",
      weatherRain: "Local rainfall is active right now, which may influence disease risk in the field.",
      weatherDry: "Current rainfall is low, which may favor irrigation-focused advisories.",
    },
    common: {
      loading: "Loading dashboard...",
      failed: "Failed to load dashboard data.",
      retry: "Refresh page to retry.",
      minsAgo: "{count} mins ago",
      hoursAgo: "{count} hours ago",
      yesterday: "Yesterday",
      daysAgo: "{count} days ago",
      justNow: "Just now",
      percentSuffix: "%",
      mmSuffix: " mm",
      celsiusSuffix: "°C",
    },
  },
  hindi: {
    title: "डैशबोर्ड",
    subtitle: "आपके FarmAid नेटवर्क से लाइव जानकारी।",
    stats: {
      totalFarmers: "कुल किसान",
      totalCropPredictions: "फसल अनुशंसाएँ",
      totalDiseaseDetections: "रोग पहचान",
      systemUsage: "सिस्टम उपयोग",
    },
    cards: {
      farmersHint: "पंजीकृत किसान खाते",
      cropHint: "कुल अनुशंसा अनुरोध",
      diseaseHint: "पूर्ण रोग स्कैन",
      usageHint: "पिछले 30 दिनों में सक्रिय किसान उपयोग",
    },
    charts: {
      activityOverview: "गतिविधि अवलोकन",
      cropDistribution: "फसल वितरण",
      recommendations: "अनुशंसाएँ",
      detections: "पहचान",
      noChartData: "अभी तक कोई विश्लेषण डेटा उपलब्ध नहीं है।",
      noCropData: "अभी तक कोई फसल वितरण डेटा उपलब्ध नहीं है।",
    },
    recent: {
      title: "हाल की गतिविधियाँ",
      viewAll: "नवीनतम 5",
      empty: "अभी तक कोई हाल की गतिविधि नहीं मिली।",
      loading: "हाल की गतिविधियाँ लोड हो रही हैं...",
      userFallback: "अज्ञात उपयोगकर्ता",
    },
    weather: {
      title: "मौसम जानकारी",
      temperature: "तापमान",
      humidity: "आर्द्रता",
      rainfall: "वर्षा",
      location: "पता किया गया स्थान",
      loading: "आपके वर्तमान स्थान से मौसम जानकारी ली जा रही है...",
      denied: "स्थान अनुमति अस्वीकृत। मौसम जानकारी उपलब्ध नहीं है।",
      unavailable: "मौसम जानकारी फिलहाल उपलब्ध नहीं है।",
      unsupported: "इस ब्राउज़र में जियोलोकेशन समर्थित नहीं है।",
    },
    insights: {
      title: "एआई इनसाइट्स",
      empty: "पर्याप्त डेटा उपलब्ध होते ही इनसाइट्स यहाँ दिखाई देंगी।",
      cropIncrease: "पिछले महीने की तुलना में फसल अनुशंसा अनुरोध {percent}% बढ़े हैं।",
      cropDecrease: "पिछले महीने की तुलना में फसल अनुशंसा अनुरोध {percent}% घटे हैं।",
      diseaseHigh: "इस महीने रोग पहचान की मात्रा अधिक है। सक्रिय किसान अलर्ट पर विचार करें।",
      diseaseStable: "हाल के महीनों की तुलना में रोग पहचान की मात्रा स्थिर दिखती है।",
      topCrop: "वर्तमान डेटा में {crop} सबसे अधिक अनुशंसित फसल है।",
      usageHigh: "सिस्टम उपयोग मजबूत है और किसान सहभागिता अच्छी दिख रही है।",
      usageLow: "सिस्टम उपयोग अभी कम है। अधिक किसान लॉगिन प्रोत्साहित करने से अपनापन बढ़ सकता है।",
      weatherRain: "आपके क्षेत्र में वर्षा सक्रिय है, जिससे खेतों में रोग जोखिम बढ़ सकता है।",
      weatherDry: "वर्तमान वर्षा कम है, इसलिए सिंचाई-केंद्रित सलाह उपयोगी हो सकती है।",
    },
    common: {
      loading: "डैशबोर्ड लोड हो रहा है...",
      failed: "डैशबोर्ड डेटा लोड नहीं हो सका।",
      retry: "फिर प्रयास करने के लिए पेज रीफ्रेश करें।",
      minsAgo: "{count} मिनट पहले",
      hoursAgo: "{count} घंटे पहले",
      yesterday: "कल",
      daysAgo: "{count} दिन पहले",
      justNow: "अभी",
      percentSuffix: "%",
      mmSuffix: " मिमी",
      celsiusSuffix: "°C",
    },
  },
  gujarati: {
    title: "ડેશબોર્ડ",
    subtitle: "તમારા FarmAid નેટવર્કમાંથી જીવંત માહિતી.",
    stats: {
      totalFarmers: "કુલ ખેડૂત",
      totalCropPredictions: "પાક ભલામણો",
      totalDiseaseDetections: "રોગ ઓળખ",
      systemUsage: "સિસ્ટમ ઉપયોગ",
    },
    cards: {
      farmersHint: "નોંધાયેલા ખેડૂત ખાતાઓ",
      cropHint: "કુલ ભલામણ વિનંતીઓ",
      diseaseHint: "પૂર્ણ થયેલ રોગ સ્કેન",
      usageHint: "છેલ્લા 30 દિવસમાં સક્રિય ખેડૂત ઉપયોગ",
    },
    charts: {
      activityOverview: "પ્રવૃત્તિ અવલોકન",
      cropDistribution: "પાક વિતરણ",
      recommendations: "ભલામણો",
      detections: "ઓળખ",
      noChartData: "હજુ સુધી કોઈ એનાલિટિક્સ ડેટા ઉપલબ્ધ નથી.",
      noCropData: "હજુ સુધી કોઈ પાક વિતરણ ડેટા ઉપલબ્ધ નથી.",
    },
    recent: {
      title: "તાજી પ્રવૃત્તિઓ",
      viewAll: "તાજેતરની 5",
      empty: "હજુ સુધી કોઈ તાજી પ્રવૃત્તિ મળી નથી.",
      loading: "તાજી પ્રવૃત્તિઓ લોડ થઈ રહી છે...",
      userFallback: "અજ્ઞાત વપરાશકર્તા",
    },
    weather: {
      title: "હવામાન માહિતી",
      temperature: "તાપમાન",
      humidity: "ભેજ",
      rainfall: "વરસાદ",
      location: "ઓળખાયેલ સ્થાન",
      loading: "તમારા વર્તમાન સ્થાન પરથી હવામાન માહિતી લેવામાં આવી રહી છે...",
      denied: "સ્થાનની મંજૂરી મળેલી નથી. હવામાન માહિતી ઉપલબ્ધ નથી.",
      unavailable: "હવામાન માહિતી હાલમાં ઉપલબ્ધ નથી.",
      unsupported: "આ બ્રાઉઝરમાં જિઓલોકેશન સપોર્ટેડ નથી.",
    },
    insights: {
      title: "AI ઇન્સાઇટ્સ",
      empty: "પૂરતો ડેટા મળતા જ ઇન્સાઇટ્સ અહીં દેખાશે.",
      cropIncrease: "પાછલા મહિનાની સરખામણીએ પાક ભલામણ વિનંતીઓ {percent}% વધી છે.",
      cropDecrease: "પાછલા મહિનાની સરખામણીએ પાક ભલામણ વિનંતીઓ {percent}% ઘટી છે.",
      diseaseHigh: "આ મહિને રોગ ઓળખનું પ્રમાણ ઊંચું છે. સક્રિય ખેડૂત એલર્ટ પર વિચાર કરો.",
      diseaseStable: "તાજેતરના મહિનાઓની સરખામણીએ રોગ ઓળખનું પ્રમાણ સ્થિર દેખાય છે.",
      topCrop: "વર્તમાન ડેટામાં {crop} સૌથી વધુ ભલામણ થયેલો પાક છે.",
      usageHigh: "સિસ્ટમ ઉપયોગ મજબૂત છે અને ખેડૂત સંકળાયેલાપણું સારું છે.",
      usageLow: "સિસ્ટમ ઉપયોગ હજુ ઓછો છે. વધુ ખેડૂત સાઇન-ઇન પ્રોત્સાહિત કરવાથી અપનાવ વધે.",
      weatherRain: "હાલમાં વરસાદ સક્રિય છે, જે ખેતરમાં રોગ જોખમ વધારી શકે છે.",
      weatherDry: "હાલ વરસાદ ઓછો છે, તેથી સિંચાઈ-કેન્દ્રિત સલાહ ઉપયોગી થઈ શકે છે.",
    },
    common: {
      loading: "ડેશબોર્ડ લોડ થઈ રહ્યું છે...",
      failed: "ડેશબોર્ડ ડેટા લોડ થઈ શક્યો નથી.",
      retry: "ફરી પ્રયાસ કરવા માટે પેજ રિફ્રેશ કરો.",
      minsAgo: "{count} મિનિટ પહેલા",
      hoursAgo: "{count} કલાક પહેલા",
      yesterday: "ગઈકાલે",
      daysAgo: "{count} દિવસ પહેલા",
      justNow: "હમણાં જ",
      percentSuffix: "%",
      mmSuffix: " મીમી",
      celsiusSuffix: "°C",
    },
  },
};

const PIE_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#64748b"];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] },
  },
};

function formatTemplate(template, values = {}) {
  return String(template || "").replace(/\{(\w+)\}/g, (_, key) => values[key] ?? `{${key}}`);
}

function formatRelativeTime(value, copy) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return copy.common.justNow;
  }

  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);

  if (minutes <= 1) {
    return copy.common.justNow;
  }

  if (minutes < 60) {
    return formatTemplate(copy.common.minsAgo, { count: minutes });
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return formatTemplate(copy.common.hoursAgo, { count: hours });
  }

  if (hours < 48) {
    return copy.common.yesterday;
  }

  const days = Math.floor(hours / 24);
  return formatTemplate(copy.common.daysAgo, { count: days });
}

function buildInsights(copy, stats, analytics, crops, weather) {
  const insights = [];
  const lastCrop = Number(analytics.cropData?.at(-1) || 0);
  const previousCrop = Number(analytics.cropData?.at(-2) || 0);
  const lastDisease = Number(analytics.diseaseData?.at(-1) || 0);
  const previousDisease = Number(analytics.diseaseData?.at(-2) || 0);

  if (previousCrop > 0 && lastCrop !== previousCrop) {
    const change = Math.round((Math.abs(lastCrop - previousCrop) / previousCrop) * 100);
    insights.push(
      formatTemplate(
        lastCrop > previousCrop ? copy.insights.cropIncrease : copy.insights.cropDecrease,
        { percent: change },
      ),
    );
  }

  if (lastDisease > 0) {
    insights.push(
      lastDisease > previousDisease && lastDisease >= 10
        ? copy.insights.diseaseHigh
        : copy.insights.diseaseStable,
    );
  }

  if (crops.length > 0) {
    insights.push(formatTemplate(copy.insights.topCrop, { crop: crops[0].name }));
  }

  if (typeof stats.systemUsage === "number") {
    insights.push(stats.systemUsage >= 60 ? copy.insights.usageHigh : copy.insights.usageLow);
  }

  if (weather && typeof weather.rainfall === "number") {
    insights.push(weather.rainfall > 0 ? copy.insights.weatherRain : copy.insights.weatherDry);
  }

  return insights.slice(0, 4);
}

async function fetchCurrentWeather() {
  if (!navigator.geolocation) {
    throw new Error("unsupported");
  }

  const coords = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000,
    });
  });

  const latitude = coords.coords.latitude;
  const longitude = coords.coords.longitude;
  const response = await getCurrentLocationWeather({ latitude, longitude });
  const data = response?.data || {};

  return {
    location: data.district ? `${data.district}, ${data.location}` : data.location || "",
    temperature: Number(data.temperature ?? 0),
    humidity: Number(data.humidity ?? 0),
    rainfall: Number(data.rainfall ?? 0),
  };
}

function StatCard({ icon: Icon, label, value, hint, color }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.02, y: -4 }}
      className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-slate-900/60 p-6 backdrop-blur-xl"
    >
      <div className={`absolute right-0 top-0 h-32 w-32 rounded-full bg-gradient-to-br ${color} opacity-10 blur-2xl`} />
      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${color}`}>
            <Icon className="text-white" size={24} />
          </div>
        </div>
        <h3 className="mb-1 text-3xl font-bold text-white">{value}</h3>
        <p className="text-sm text-slate-300">{label}</p>
        <p className="mt-2 text-xs text-slate-500">{hint}</p>
      </div>
    </motion.div>
  );
}

export function AdminDashboard() {
  const { language } = useLanguage();
  const copy = getLocalizedCopy(language, ADMIN_DASHBOARD_COPY);

  const [stats, setStats] = useState({
    totalFarmers: 0,
    totalCropPredictions: 0,
    totalDiseaseDetections: 0,
    systemUsage: 0,
  });
  const [analytics, setAnalytics] = useState({
    months: [],
    cropData: [],
    diseaseData: [],
  });
  const [cropDistribution, setCropDistribution] = useState([]);
  const [activities, setActivities] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      setLoading(true);
      setError("");

      const [statsResult, activitiesResult, analyticsResult, cropsResult] = await Promise.allSettled([
        getDashboardStats(),
        getAdminRecentActivities(5),
        getDashboardAnalytics(),
        getDashboardCropDistribution(),
      ]);

      if (cancelled) {
        return;
      }

      if (statsResult.status === "fulfilled") {
        setStats((previous) => ({ ...previous, ...statsResult.value }));
      }

      if (activitiesResult.status === "fulfilled") {
        setActivities(activitiesResult.value);
      }

      if (analyticsResult.status === "fulfilled") {
        setAnalytics(analyticsResult.value);
      }

      if (cropsResult.status === "fulfilled") {
        setCropDistribution(cropsResult.value);
      }

      const hasFailure = [statsResult, activitiesResult, analyticsResult, cropsResult].some(
        (result) => result.status === "rejected",
      );

      if (hasFailure) {
        const failedResult = [statsResult, activitiesResult, analyticsResult, cropsResult].find(
          (result) => result.status === "rejected",
        );
        setError(failedResult?.reason?.response?.data?.error || copy.common.failed);
      }

      setLoading(false);
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [copy.common.failed]);

  useEffect(() => {
    let cancelled = false;

    async function loadWeather() {
      setWeatherLoading(true);
      setWeatherError("");

      try {
        const result = await fetchCurrentWeather();
        if (!cancelled) {
          setWeather(result);
        }
      } catch (weatherRequestError) {
        if (cancelled) {
          return;
        }

        if (weatherRequestError?.message === "unsupported") {
          setWeatherError(copy.weather.unsupported);
        } else if (weatherRequestError?.code === 1) {
          setWeatherError(copy.weather.denied);
        } else {
          setWeatherError(
            weatherRequestError?.response?.data?.error ||
              weatherRequestError?.response?.data?.message ||
              copy.weather.unavailable,
          );
        }
      } finally {
        if (!cancelled) {
          setWeatherLoading(false);
        }
      }
    }

    loadWeather();

    return () => {
      cancelled = true;
    };
  }, [copy.weather.denied, copy.weather.unavailable, copy.weather.unsupported]);

  const statsData = [
    {
      icon: Users,
      label: copy.stats.totalFarmers,
      value: stats.totalFarmers.toLocaleString(),
      hint: copy.cards.farmersHint,
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Sprout,
      label: copy.stats.totalCropPredictions,
      value: stats.totalCropPredictions.toLocaleString(),
      hint: copy.cards.cropHint,
      color: "from-emerald-500 to-green-500",
    },
    {
      icon: Scan,
      label: copy.stats.totalDiseaseDetections,
      value: stats.totalDiseaseDetections.toLocaleString(),
      hint: copy.cards.diseaseHint,
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Activity,
      label: copy.stats.systemUsage,
      value: `${stats.systemUsage}${copy.common.percentSuffix}`,
      hint: copy.cards.usageHint,
      color: "from-orange-500 to-amber-500",
    },
  ];

  const chartData = analytics.months.map((month, index) => ({
    month,
    recommendations: Number(analytics.cropData[index] || 0),
    detections: Number(analytics.diseaseData[index] || 0),
  }));

  const insights = buildInsights(copy, stats, analytics, cropDistribution, weather);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      <motion.div variants={itemVariants}>
        <h1 className="mb-2 text-4xl font-bold text-white">{copy.title}</h1>
        <p className="text-emerald-400">{copy.subtitle}</p>
      </motion.div>

      {error ? (
        <motion.div
          variants={itemVariants}
          className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-200"
        >
          {error} {copy.common.retry}
        </motion.div>
      ) : null}

      <motion.div variants={containerVariants} className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </motion.div>

      {loading ? (
        <motion.div variants={itemVariants} className="rounded-2xl border border-emerald-500/20 bg-slate-900/60 p-6 text-slate-300">
          {copy.common.loading}
        </motion.div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 rounded-2xl border border-emerald-500/20 bg-slate-900/60 p-6 backdrop-blur-xl"
        >
          <h2 className="mb-6 text-xl font-bold text-white">{copy.charts.activityOverview}</h2>
          {chartData.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #10b981",
                    borderRadius: "12px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="recommendations"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", r: 5 }}
                  name={copy.charts.recommendations}
                />
                <Line
                  type="monotone"
                  dataKey="detections"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ fill: "#8b5cf6", r: 5 }}
                  name={copy.charts.detections}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-700 p-10 text-sm text-slate-400">
              {copy.charts.noChartData}
            </div>
          )}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="rounded-2xl border border-emerald-500/20 bg-slate-900/60 p-6 backdrop-blur-xl"
        >
          <h2 className="mb-6 text-xl font-bold text-white">{copy.charts.cropDistribution}</h2>
          {cropDistribution.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={cropDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={88}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, value }) => `${name} ${value}%`}
                  labelLine={false}
                >
                  {cropDistribution.map((entry, index) => (
                    <Cell key={`${entry.name}-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #10b981",
                    borderRadius: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-700 p-10 text-sm text-slate-400">
              {copy.charts.noCropData}
            </div>
          )}
        </motion.div>
      </div>

      <motion.div
        variants={itemVariants}
        className="rounded-2xl border border-emerald-500/20 bg-slate-900/60 p-6 backdrop-blur-xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{copy.recent.title}</h2>
          <span className="text-sm font-medium text-emerald-400">{copy.recent.viewAll}</span>
        </div>

        {loading ? (
          <div className="text-sm text-slate-400">{copy.recent.loading}</div>
        ) : activities.length ? (
          <div className="space-y-4">
            {activities.map((entry, index) => (
              <motion.div
                key={`${entry.userName}-${entry.createdAt}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
                className="flex items-center gap-4 rounded-xl border border-slate-800 p-4 transition-all hover:border-emerald-500/30 hover:bg-emerald-500/5"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-600 text-sm font-bold text-white">
                  {(entry.userName || copy.recent.userFallback)
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-white">{entry.userName || copy.recent.userFallback}</p>
                  <p className="truncate text-sm text-slate-400">{entry.message}</p>
                </div>

                <div className="hidden items-center gap-2 text-sm text-slate-400 sm:flex">
                  <MapPin size={14} className="text-emerald-400" />
                  <span>{entry.location || "-"}</span>
                </div>

                <span className="flex-shrink-0 text-xs text-slate-500">
                  {formatRelativeTime(entry.createdAt, copy)}
                </span>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-slate-400">{copy.recent.empty}</div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <motion.div
          variants={itemVariants}
          className="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-900/40 to-cyan-900/40 p-6 backdrop-blur-xl"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">{copy.weather.title}</h2>
            <Cloud className="text-blue-400" size={32} />
          </div>

          {weatherLoading ? (
            <p className="text-sm text-slate-300">{copy.weather.loading}</p>
          ) : weatherError ? (
            <p className="text-sm text-slate-300">{weatherError}</p>
          ) : weather ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">{copy.weather.location}</span>
                <span className="text-right text-white">{weather.location || "-"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">{copy.weather.temperature}</span>
                <span className="text-xl font-bold text-white">
                  {Math.round(weather.temperature)}
                  {copy.common.celsiusSuffix}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">{copy.weather.humidity}</span>
                <span className="text-xl font-bold text-white">
                  {Math.round(weather.humidity)}
                  {copy.common.percentSuffix}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">{copy.weather.rainfall}</span>
                <span className="text-xl font-bold text-white">
                  {weather.rainfall.toFixed(1)}
                  {copy.common.mmSuffix}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-300">{copy.weather.unavailable}</p>
          )}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-900/40 to-green-900/40 p-6 backdrop-blur-xl"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">{copy.insights.title}</h2>
            <TrendingUp className="text-emerald-400" size={32} />
          </div>

          {insights.length ? (
            <div className="space-y-3">
              {insights.map((insight) => (
                <p key={insight} className="text-sm leading-relaxed text-slate-200">
                  {insight}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-300">{copy.insights.empty}</p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
