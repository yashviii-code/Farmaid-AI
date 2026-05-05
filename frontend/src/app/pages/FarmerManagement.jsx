import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Eye, Mail, MapPin, Phone, Search, Trash2, X } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { getLocalizedCopy } from "../lib/getLocalizedCopy";
import {
  deleteFarmerById,
  getFarmerById,
  getFarmers,
  getFarmerStats,
} from "../api/farmers.api";

const FARMER_MANAGEMENT_COPY = {
  english: {
    title: "Farmer Management",
    subtitle: "Manage and monitor real farmer profiles and activity.",
    stats: {
      totalFarmers: "Total Farmers",
      activeToday: "Active Today",
      newThisMonth: "New This Month",
      totalFarmArea: "Total Farm Area",
    },
    statHints: {
      totalFarmers: "Visible farmer accounts",
      activeToday: "Farmers with crop or disease activity today",
      newThisMonth: "Farmer accounts created this month",
      totalFarmArea: "Combined reported farm area",
    },
    searchPlaceholder: "Search by name, email, or location...",
    filters: {
      allLocations: "All Locations",
      allActivity: "All Activity",
      recommendations: "Recommendations",
      detections: "Detections",
      highActivity: "High Activity",
    },
    table: {
      farmer: "Farmer",
      location: "Location",
      farmSize: "Farm Size",
      crops: "Crops",
      activity: "Activity",
      joined: "Joined",
      actions: "Actions",
      recommendations: "recommendations",
      detections: "detections",
      noFarmers: "No farmers match the current search or filters.",
    },
    buttons: {
      view: "View",
      delete: "Delete",
      previous: "Previous",
      next: "Next",
      close: "Close",
      loading: "Loading farmers...",
      deleting: "Deleting...",
    },
    pagination: {
      summary: "Showing {start} to {end} of {total} farmers",
    },
    modal: {
      title: "Farmer Details",
      recentActivity: "Recent Activity",
      noActivity: "No recent farmer activity found.",
      contact: "Contact",
      profile: "Profile",
    },
    error: {
      loadFarmers: "Failed to load farmers.",
      loadStats: "Failed to load farmer stats.",
      loadFarmer: "Failed to load farmer details.",
      deleteFarmer: "Failed to delete farmer.",
      confirmDelete: "Are you sure you want to delete this farmer?",
    },
    common: {
      acres: "acres",
      notAvailable: "N/A",
    },
  },
};

const PAGE_SIZE = 10;

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function FarmerStatCard({ label, value, hint, color }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      className="rounded-2xl border border-emerald-500/20 bg-slate-900/60 p-6 backdrop-blur-xl"
    >
      <div className={`mb-4 h-12 w-12 rounded-xl bg-gradient-to-br ${color}`} />
      <h3 className="mb-1 text-2xl font-bold text-white">{value}</h3>
      <p className="text-sm text-slate-300">{label}</p>
      <p className="mt-2 text-xs text-slate-500">{hint}</p>
    </motion.div>
  );
}

function FarmerDetailModal({ farmer, copy, onClose }) {
  if (!farmer) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-3xl border border-emerald-500/20 bg-slate-900 p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">{copy.modal.title}</h2>
            <p className="mt-1 text-slate-400">{farmer.name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-700 p-2 text-slate-300 transition hover:border-slate-500 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <h3 className="mb-4 text-lg font-semibold text-white">{copy.modal.contact}</h3>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-emerald-400" />
                <span>{farmer.email || copy.common.notAvailable}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-emerald-400" />
                <span>{farmer.phone || copy.common.notAvailable}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-emerald-400" />
                <span>{farmer.location || copy.common.notAvailable}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <h3 className="mb-4 text-lg font-semibold text-white">{copy.modal.profile}</h3>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-400">{copy.table.farmSize}</span>
                <span>{farmer.farmSize || copy.common.notAvailable}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-400">{copy.table.joined}</span>
                <span>{formatDate(farmer.joinedDate)}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-400">{copy.table.activity}</span>
                <span>
                  {farmer.recommendations} {copy.table.recommendations} · {farmer.detections}{" "}
                  {copy.table.detections}
                </span>
              </div>
              <div>
                <div className="mb-2 text-slate-400">{copy.table.crops}</div>
                <div className="flex flex-wrap gap-2">
                  {farmer.crops?.length ? (
                    farmer.crops.map((crop) => (
                      <span
                        key={crop}
                        className="rounded-lg bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-300"
                      >
                        {crop}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-400">{copy.common.notAvailable}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
          <h3 className="mb-4 text-lg font-semibold text-white">{copy.modal.recentActivity}</h3>
          {farmer.recentActivity?.length ? (
            <div className="space-y-3">
              {farmer.recentActivity.map((entry) => (
                <div
                  key={`${entry.type}-${entry.createdAt}-${entry.message}`}
                  className="rounded-xl border border-slate-800 px-4 py-3 text-sm text-slate-300"
                >
                  <div className="font-medium text-white">{entry.message}</div>
                  <div className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                    {entry.type} · {formatDate(entry.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">{copy.modal.noActivity}</p>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            {copy.buttons.close}
          </button>
        </div>
      </div>
    </div>
  );
}

export function FarmerManagement() {
  const { language } = useLanguage();
  const copy = getLocalizedCopy(language, FARMER_MANAGEMENT_COPY);

  const [farmers, setFarmers] = useState([]);
  const [stats, setStats] = useState({
    totalFarmers: 0,
    activeToday: 0,
    newThisMonth: 0,
    totalFarmArea: 0,
  });
  const [availableLocations, setAvailableLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("all");
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [detailLoadingId, setDetailLoadingId] = useState("");
  const [deletingFarmerId, setDeletingFarmerId] = useState("");
  const [error, setError] = useState("");
  const [statsError, setStatsError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadFarmers() {
      setLoading(true);
      setError("");

      try {
        const response = await getFarmers({ limit: 100 });
        if (cancelled) {
          return;
        }

        setFarmers(response.farmers || []);
        setAvailableLocations(response.filters?.locations || []);
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError.response?.data?.error || copy.error.loadFarmers);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadFarmers();
    return () => {
      cancelled = true;
    };
  }, [copy.error.loadFarmers]);

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      setStatsLoading(true);
      setStatsError("");

      try {
        const response = await getFarmerStats();
        if (!cancelled) {
          setStats(response);
        }
      } catch (requestError) {
        if (!cancelled) {
          setStatsError(requestError.response?.data?.error || copy.error.loadStats);
        }
      } finally {
        if (!cancelled) {
          setStatsLoading(false);
        }
      }
    }

    loadStats();
    return () => {
      cancelled = true;
    };
  }, [copy.error.loadStats]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedLocation, selectedActivity]);

  const filteredFarmers = farmers.filter((farmer) => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !normalizedSearch ||
      farmer.name.toLowerCase().includes(normalizedSearch) ||
      farmer.email.toLowerCase().includes(normalizedSearch) ||
      farmer.location.toLowerCase().includes(normalizedSearch);
    const matchesLocation = !selectedLocation || farmer.location === selectedLocation;
    const matchesActivity =
      selectedActivity === "all" ||
      (selectedActivity === "recommendations" && farmer.recommendations > 0) ||
      (selectedActivity === "detections" && farmer.detections > 0) ||
      (selectedActivity === "high_activity" && farmer.recommendations + farmer.detections >= 5);

    return matchesSearch && matchesLocation && matchesActivity;
  });

  const totalPages = Math.max(1, Math.ceil(filteredFarmers.length / PAGE_SIZE));
  const paginatedFarmers = filteredFarmers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const statsCards = [
    {
      label: copy.stats.totalFarmers,
      value: statsLoading ? "..." : stats.totalFarmers.toLocaleString(),
      hint: copy.statHints.totalFarmers,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: copy.stats.activeToday,
      value: statsLoading ? "..." : stats.activeToday.toLocaleString(),
      hint: copy.statHints.activeToday,
      color: "from-emerald-500 to-green-500",
    },
    {
      label: copy.stats.newThisMonth,
      value: statsLoading ? "..." : stats.newThisMonth.toLocaleString(),
      hint: copy.statHints.newThisMonth,
      color: "from-purple-500 to-pink-500",
    },
    {
      label: copy.stats.totalFarmArea,
      value: statsLoading ? "..." : `${stats.totalFarmArea.toLocaleString()} ${copy.common.acres}`,
      hint: copy.statHints.totalFarmArea,
      color: "from-orange-500 to-amber-500",
    },
  ];

  const handleViewFarmer = async (farmerId) => {
    setDetailLoadingId(farmerId);
    setError("");

    try {
      const farmer = await getFarmerById(farmerId);
      setSelectedFarmer(farmer);
    } catch (requestError) {
      setError(requestError.response?.data?.error || copy.error.loadFarmer);
    } finally {
      setDetailLoadingId("");
    }
  };

  const handleDeleteFarmer = async (farmerId) => {
    if (!window.confirm(copy.error.confirmDelete)) {
      return;
    }

    setDeletingFarmerId(farmerId);
    setError("");

    try {
      await deleteFarmerById(farmerId);
      setFarmers((previous) => previous.filter((farmer) => farmer.id !== farmerId));
      setSelectedFarmer((previous) => (previous?.id === farmerId ? null : previous));
      try {
        const nextStats = await getFarmerStats();
        setStats(nextStats);
      } catch {
        setStats((previous) => ({
          ...previous,
          totalFarmers: Math.max(0, previous.totalFarmers - 1),
        }));
      }
    } catch (requestError) {
      setError(requestError.response?.data?.error || copy.error.deleteFarmer);
    } finally {
      setDeletingFarmerId("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="mb-2 text-4xl font-bold text-white">{copy.title}</h1>
        <p className="text-emerald-400">{copy.subtitle}</p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {statsError ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {statsError}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {statsCards.map((stat) => (
          <FarmerStatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            hint={stat.hint}
            color={stat.color}
          />
        ))}
      </div>

      <div className="rounded-2xl border border-emerald-500/20 bg-slate-900/60 p-6 backdrop-blur-xl">
        <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={copy.searchPlaceholder}
              className="w-full rounded-xl border border-slate-700 bg-slate-800/50 py-3 pl-11 pr-4 text-white outline-none transition-colors focus:border-emerald-500"
            />
          </div>

          <select
            value={selectedLocation}
            onChange={(event) => setSelectedLocation(event.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-white outline-none transition-colors focus:border-emerald-500"
          >
            <option value="">{copy.filters.allLocations}</option>
            {availableLocations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>

          <select
            value={selectedActivity}
            onChange={(event) => setSelectedActivity(event.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-white outline-none transition-colors focus:border-emerald-500"
          >
            <option value="all">{copy.filters.allActivity}</option>
            <option value="recommendations">{copy.filters.recommendations}</option>
            <option value="detections">{copy.filters.detections}</option>
            <option value="high_activity">{copy.filters.highActivity}</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-emerald-500/20 bg-slate-900/60 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-emerald-500/20 bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-emerald-400">{copy.table.farmer}</th>
                <th className="px-6 py-4 text-left font-semibold text-emerald-400">{copy.table.location}</th>
                <th className="px-6 py-4 text-left font-semibold text-emerald-400">{copy.table.farmSize}</th>
                <th className="px-6 py-4 text-left font-semibold text-emerald-400">{copy.table.crops}</th>
                <th className="px-6 py-4 text-left font-semibold text-emerald-400">{copy.table.activity}</th>
                <th className="px-6 py-4 text-left font-semibold text-emerald-400">{copy.table.joined}</th>
                <th className="px-6 py-4 text-left font-semibold text-emerald-400">{copy.table.actions}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-slate-400">
                    {copy.buttons.loading}
                  </td>
                </tr>
              ) : paginatedFarmers.length ? (
                paginatedFarmers.map((farmer, index) => (
                  <motion.tr
                    key={farmer.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="border-b border-slate-800 transition-colors hover:bg-emerald-500/5"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-600">
                          <span className="text-sm font-bold text-white">
                            {farmer.name
                              .split(" ")
                              .map((part) => part[0])
                              .join("")
                              .slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-white">{farmer.name}</p>
                          <p className="flex items-center gap-1 text-sm text-slate-400">
                            <Mail size={12} />
                            {farmer.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <MapPin size={16} className="text-emerald-400" />
                        {farmer.location || copy.common.notAvailable}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white">{farmer.farmSize || copy.common.notAvailable}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {farmer.crops.length ? (
                          farmer.crops.map((crop) => (
                            <span
                              key={`${farmer.id}-${crop}`}
                              className="rounded-lg bg-emerald-500/20 px-2 py-1 text-xs font-semibold text-emerald-300"
                            >
                              {crop}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-slate-400">{copy.common.notAvailable}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1 text-sm text-slate-300">
                        <p>
                          <span className="font-semibold text-emerald-400">{farmer.recommendations}</span>{" "}
                          {copy.table.recommendations}
                        </p>
                        <p>
                          <span className="font-semibold text-purple-400">{farmer.detections}</span>{" "}
                          {copy.table.detections}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">{formatDate(farmer.joinedDate)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleViewFarmer(farmer.id)}
                          disabled={detailLoadingId === farmer.id}
                          className="rounded-lg bg-blue-500/20 p-2 text-blue-400 transition hover:bg-blue-500/30 disabled:opacity-60"
                          title={copy.buttons.view}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteFarmer(farmer.id)}
                          disabled={deletingFarmerId === farmer.id}
                          className="rounded-lg bg-red-500/20 p-2 text-red-400 transition hover:bg-red-500/30 disabled:opacity-60"
                          title={copy.buttons.delete}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-slate-400">
                    {copy.table.noFarmers}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-emerald-500/20 bg-slate-900/60 p-4 backdrop-blur-xl">
        <p className="text-sm text-slate-400">
          {copy.pagination.summary
            .replace("{start}", filteredFarmers.length ? String((currentPage - 1) * PAGE_SIZE + 1) : "0")
            .replace("{end}", String(Math.min(currentPage * PAGE_SIZE, filteredFarmers.length)))
            .replace("{total}", String(filteredFarmers.length))}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1}
            className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white transition hover:bg-slate-700 disabled:opacity-50"
          >
            {copy.buttons.previous}
          </button>
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            disabled={currentPage >= totalPages}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-white transition hover:bg-emerald-600 disabled:opacity-50"
          >
            {copy.buttons.next}
          </button>
        </div>
      </div>

      <FarmerDetailModal farmer={selectedFarmer} copy={copy} onClose={() => setSelectedFarmer(null)} />
    </motion.div>
  );
}
