import { motion, AnimatePresence } from 'motion/react';
import { Activity, Clock, User, MapPin, Filter, TrendingUp, TrendingDown, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedCopy } from '../lib/getLocalizedCopy';
import { fetchLogs, fetchLogsStats } from '../api/logs.api';

const LOGS_COPY = {
  english: {
    title: 'Logs & Monitoring',
    subtitle: 'Track system activities and user interactions',
    stats: ['Total Activities', "Today's Logs", 'Active Users', 'Avg Response Time'],
    filters: {
      all: 'All Activities',
      recommendation: 'Recommendations',
      disease: 'Disease Detections',
      upload: 'Uploads',
      auth: 'Authentication',
      profile: 'Profile Changes',
    },
    loadMore: 'Load More Logs',
    loading: 'Loading logs...',
    noLogs: 'No activity logs found',
    error: 'Failed to load logs',
    retry: 'Retry',
  },
  hindi: {
    title: 'लॉग्स और मॉनिटरिंग',
    subtitle: 'सिस्टम गतिविधियों और उपयोगकर्ता इंटरैक्शन को ट्रैक करें',
    stats: ['कुल गतिविधियाँ', 'आज के लॉग्स', 'सक्रिय उपयोगकर्ता', 'औसत प्रतिक्रिया समय'],
    filters: {
      all: 'सभी गतिविधियाँ',
      recommendation: 'सिफारिशें',
      disease: 'रोग पहचान',
      upload: 'अपलोड',
      auth: 'प्रमाणीकरण',
      profile: 'प्रोफाइल परिवर्तन',
    },
    loadMore: 'और लॉग्स लोड करें',
    loading: 'लॉग्स लोड हो रहे हैं...',
    noLogs: 'कोई गतिविधि लॉग नहीं मिला',
    error: 'लॉग्स लोड करने में विफल',
    retry: 'पुनः प्रयास करें',
  },
  gujarati: {
    title: 'લૉગ્સ અને મોનીટરીંગ',
    subtitle: 'સિસ્ટમ પ્રવૃત્તિઓ અને વપરાશકર્તા ક્રિયાઓને ટ્રેક કરો',
    stats: ['કુલ પ્રવૃત્તિઓ', 'આજના લૉગ્સ', 'સક્રિય વપરાશકર્તાઓ', 'સરેરાશ પ્રતિસાદ સમય'],
    filters: {
      all: 'બધી પ્રવૃત્તિઓ',
      recommendation: 'ભલામણો',
      disease: 'રોગ ઓળખ',
      upload: 'અપલોડ',
      auth: 'પ્રમાણીકરણ',
      profile: 'પ્રોફાઇલ ફેરફારો',
    },
    loadMore: 'વધુ લૉગ્સ લોડ કરો',
    loading: 'લૉગ્સ લોડ થઈ રહ્યા છે...',
    noLogs: 'કોઈ પ્રવૃત્તિ લૉગ્સ મળ્યા નથી',
    error: 'લૉગ્સ લોડ કરવામાં નિષ્ફળ',
    retry: 'ફરી પ્રયાસ કરો',
  },
};

const LOG_TYPE_CONFIG = {
  all:            { color: 'from-slate-500 to-slate-600',    badge: 'bg-slate-500/20 text-slate-300 border-slate-500/30' },
  recommendation: { color: 'from-emerald-500 to-green-500',  badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  disease:        { color: 'from-purple-500 to-pink-500',    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  upload:         { color: 'from-blue-500 to-cyan-500',      badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  auth:           { color: 'from-orange-500 to-amber-500',   badge: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
  profile:        { color: 'from-indigo-500 to-purple-500',  badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
  crop:           { color: 'from-emerald-500 to-green-500',  badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
};

function formatTimeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString();
}

function formatCount(n) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

function StatCard({ label, value, color, isLoading }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -5 }}
      className="bg-slate-900/60 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6"
    >
      <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl mb-4 flex items-center justify-center`}>
        {isLoading ? (
          <Loader2 className="text-white animate-spin" size={20} />
        ) : (
          <Activity className="text-white" size={20} />
        )}
      </div>
      <h3 className="text-2xl font-bold text-white mb-1">
        {isLoading ? (
          <span className="inline-block w-16 h-7 bg-slate-700 rounded animate-pulse" />
        ) : (
          value
        )}
      </h3>
      <p className="text-slate-400 text-sm">{label}</p>
    </motion.div>
  );
}

function LogSkeleton() {
  return (
    <div className="flex gap-4 p-5 rounded-xl border border-slate-800 animate-pulse">
      <div className="w-12 h-12 bg-slate-700 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-slate-700 rounded w-2/3" />
        <div className="h-3 bg-slate-800 rounded w-1/2" />
        <div className="flex gap-4">
          <div className="h-3 bg-slate-800 rounded w-24" />
          <div className="h-3 bg-slate-800 rounded w-20" />
          <div className="h-3 bg-slate-800 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

export function Logs() {
  const { language } = useLanguage();
  const copy = getLocalizedCopy(language, LOGS_COPY);

  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [error, setError] = useState(null);

  const filterKeys = ['all', 'recommendation', 'disease', 'upload', 'auth', 'profile'];
  const logTypes = filterKeys.map((key) => ({
    value: key,
    label: copy.filters[key],
    ...LOG_TYPE_CONFIG[key],
  }));

  // Fetch stats
  useEffect(() => {
    let cancelled = false;
    setIsStatsLoading(true);

    fetchLogsStats()
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch(() => {
        if (!cancelled) setStats(null);
      })
      .finally(() => {
        if (!cancelled) setIsStatsLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  // Fetch logs whenever filter changes
  const loadLogs = useCallback(async (filterVal, pageVal, append = false) => {
    try {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
        setError(null);
      }

      const result = await fetchLogs({ type: filterVal, page: pageVal, limit: 20 });

      if (append) {
        setLogs((prev) => [...prev, ...result.logs]);
      } else {
        setLogs(result.logs);
      }

      setTotal(result.total);
      setTotalPages(result.pagination.totalPages);
      setPage(pageVal);
    } catch (err) {
      if (!append) {
        setError(err.message || 'Failed to load logs');
      }
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    loadLogs(filterType, 1, false);
  }, [filterType, loadLogs]);

  const handleFilterChange = (type) => {
    setFilterType(type);
  };

  const handleLoadMore = () => {
    if (page < totalPages) {
      loadLogs(filterType, page + 1, true);
    }
  };

  const handleRetry = () => {
    loadLogs(filterType, 1, false);
    fetchLogsStats().then(setStats).catch(() => setStats(null));
  };

  const getLogTypeColor = (type) => LOG_TYPE_CONFIG[type]?.color || LOG_TYPE_CONFIG.all.color;
  const getLogBadgeClass = (type) => LOG_TYPE_CONFIG[type]?.badge || LOG_TYPE_CONFIG.all.badge;

  const statCards = [
    { label: copy.stats[0], value: stats ? formatCount(stats.totalActivities) : '—', color: 'from-blue-500 to-cyan-500' },
    { label: copy.stats[1], value: stats ? formatCount(stats.todayLogs) : '—', color: 'from-emerald-500 to-green-500' },
    { label: copy.stats[2], value: stats ? formatCount(stats.activeUsers) : '—', color: 'from-purple-500 to-pink-500' },
    { label: copy.stats[3], value: stats?.avgResponseTime || '—', color: 'from-orange-500 to-amber-500' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">{copy.title}</h1>
          <p className="text-emerald-400">{copy.subtitle}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05, rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRetry}
          className="p-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-400 hover:text-white hover:border-emerald-500/50 transition-all"
          title="Refresh"
        >
          <RefreshCw size={20} />
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <StatCard
            key={card.label}
            label={card.label}
            value={card.value}
            color={card.color}
            isLoading={isStatsLoading}
          />
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-2">
        <div className="flex flex-wrap gap-2">
          {logTypes.map((type) => (
            <motion.button
              key={type.value}
              onClick={() => handleFilterChange(type.value)}
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
                  layoutId="filterHighlight"
                  className={`absolute inset-0 bg-gradient-to-r ${type.color} opacity-20 rounded-xl border border-white/20`}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                />
              )}
              <Filter size={16} className="relative z-10" />
              <span className="relative z-10">{type.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Error State */}
      {error && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 flex items-center gap-4"
        >
          <AlertCircle className="text-red-400 flex-shrink-0" size={24} />
          <div className="flex-1">
            <p className="text-red-300 font-semibold">{copy.error}</p>
            <p className="text-red-400/70 text-sm mt-1">{error}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRetry}
            className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-2 rounded-xl hover:bg-red-500/30 transition-colors font-semibold text-sm"
          >
            {copy.retry}
          </motion.button>
        </motion.div>
      )}

      {/* Logs Timeline */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-8">
        <div className="space-y-4">
          {/* Loading skeletons */}
          {isLoading && (
            <>
              {[...Array(5)].map((_, i) => (
                <LogSkeleton key={`skeleton-${i}`} />
              ))}
            </>
          )}

          {/* Empty state */}
          {!isLoading && !error && logs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Activity className="mx-auto text-slate-600 mb-4" size={48} />
              <p className="text-slate-400 text-lg">{copy.noLogs}</p>
            </motion.div>
          )}

          {/* Log entries */}
          <AnimatePresence mode="popLayout">
            {!isLoading && logs.map((log, index) => (
              <motion.div
                key={log.id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index < 20 ? index * 0.03 : 0 }}
                whileHover={{ x: 8, backgroundColor: 'rgba(16, 185, 129, 0.05)' }}
                className="relative flex gap-4 p-5 rounded-xl border border-slate-800 hover:border-emerald-500/30 transition-all"
              >
                {/* Timeline Dot */}
                <div className="relative flex-shrink-0">
                  <div className={`w-12 h-12 bg-gradient-to-br ${getLogTypeColor(log.type)} rounded-full flex items-center justify-center`}>
                    <Activity className="text-white" size={20} />
                  </div>
                  {index < logs.length - 1 && (
                    <div className="absolute top-12 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-slate-800" />
                  )}
                </div>

                {/* Log Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-white font-bold mb-1">{log.message}</h3>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getLogBadgeClass(log.type)}`}>
                      {log.type}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-3">
                    {log.userName && (
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <User size={14} className="text-emerald-400" />
                        <span>{log.userName}</span>
                      </div>
                    )}
                    {log.location && (
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <MapPin size={14} className="text-blue-400" />
                        <span>{log.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Clock size={14} className="text-purple-400" />
                      <span>{formatTimeAgo(log.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading more indicator */}
          {isLoadingMore && (
            <div className="flex items-center justify-center gap-2 py-4 text-slate-400">
              <Loader2 className="animate-spin" size={20} />
              <span>{copy.loading}</span>
            </div>
          )}
        </div>
      </div>

      {/* Load More + Pagination Info */}
      {!isLoading && !error && logs.length > 0 && page < totalPages && (
        <div className="text-center space-y-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="bg-slate-800 border border-slate-700 text-white px-8 py-3 rounded-xl hover:bg-slate-700 hover:border-emerald-500/50 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoadingMore ? copy.loading : copy.loadMore}
          </motion.button>
          <p className="text-slate-500 text-sm">
            Showing {logs.length} of {total} logs
          </p>
        </div>
      )}

      {!isLoading && !error && logs.length > 0 && page >= totalPages && (
        <p className="text-center text-slate-500 text-sm">
          Showing all {total} logs
        </p>
      )}
    </motion.div>
  );
}
