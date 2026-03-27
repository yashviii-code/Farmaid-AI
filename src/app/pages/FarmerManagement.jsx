import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, MapPin, Phone, Mail, MoreVertical, Eye, Trash2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedCopy } from '../lib/getLocalizedCopy';

const FARMER_MANAGEMENT_COPY = {
  english: {
    title: 'Farmer Management',
    subtitle: 'Manage and monitor farmer profiles and activities',
    stats: ['Total Farmers', 'Active Today', 'New This Month', 'Total Farm Area'],
    searchPlaceholder: 'Search by name or location...',
    filters: { all: 'All Farmers', active: 'Active Today', new: 'New This Month' },
    table: {
      farmer: 'Farmer',
      location: 'Location',
      farmSize: 'Farm Size',
      crops: 'Crops',
      activity: 'Activity',
      joined: 'Joined',
      actions: 'Actions',
      recommendations: 'recommendations',
      detections: 'detections',
    },
    pagination: {
      summary: 'Showing 1 to 5 of 2,847 farmers',
      previous: 'Previous',
      next: 'Next',
    },
  },
  hindi: {
    title: 'किसान प्रबंधन',
    subtitle: 'किसान प्रोफाइल और गतिविधियों का प्रबंधन व निगरानी करें',
    stats: ['कुल किसान', 'आज सक्रिय', 'इस महीने नए', 'कुल खेती क्षेत्र'],
    searchPlaceholder: 'नाम या स्थान से खोजें...',
    filters: { all: 'सभी किसान', active: 'आज सक्रिय', new: 'इस महीने नए' },
    table: {
      farmer: 'किसान',
      location: 'स्थान',
      farmSize: 'खेत का आकार',
      crops: 'फसलें',
      activity: 'गतिविधि',
      joined: 'जुड़े',
      actions: 'कार्रवाई',
      recommendations: 'सिफारिशें',
      detections: 'पहचान',
    },
    pagination: {
      summary: '2,847 किसानों में से 1 से 5 दिखाए जा रहे हैं',
      previous: 'पिछला',
      next: 'अगला',
    },
  },
  gujarati: {
    title: 'ખેડૂત વ્યવસ્થાપન',
    subtitle: 'ખેડૂત પ્રોફાઇલ અને પ્રવૃત્તિઓનું સંચાલન અને નિરીક્ષણ કરો',
    stats: ['કુલ ખેડૂત', 'આજે સક્રિય', 'આ મહિને નવા', 'કુલ ખેતી વિસ્તાર'],
    searchPlaceholder: 'નામ અથવા સ્થાન દ્વારા શોધો...',
    filters: { all: 'બધા ખેડૂત', active: 'આજે સક્રિય', new: 'આ મહિને નવા' },
    table: {
      farmer: 'ખેડૂત',
      location: 'સ્થાન',
      farmSize: 'ફાર્મ સાઈઝ',
      crops: 'પાકો',
      activity: 'પ્રવૃત્તિ',
      joined: 'જોડાયા',
      actions: 'ક્રિયાઓ',
      recommendations: 'ભલામણો',
      detections: 'ઓળખ',
    },
    pagination: {
      summary: '2,847 ખેડૂતોમાંથી 1 થી 5 દર્શાવાઈ રહ્યા છે',
      previous: 'પાછળ',
      next: 'આગળ',
    },
  },
};

const FARMERS = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    location: 'Punjab',
    phone: '+91 98765 43210',
    email: 'rajesh.k@example.com',
    farmSize: '10 acres',
    crops: ['Rice', 'Wheat'],
    recommendations: 24,
    detections: 8,
    joinedDate: 'Jan 15, 2026',
  },
  {
    id: 2,
    name: 'Priya Sharma',
    location: 'Maharashtra',
    phone: '+91 98765 43211',
    email: 'priya.s@example.com',
    farmSize: '15 acres',
    crops: ['Cotton', 'Sugarcane'],
    recommendations: 31,
    detections: 12,
    joinedDate: 'Feb 3, 2026',
  },
  {
    id: 3,
    name: 'Amit Patel',
    location: 'Gujarat',
    phone: '+91 98765 43212',
    email: 'amit.p@example.com',
    farmSize: '8 acres',
    crops: ['Groundnut', 'Cotton'],
    recommendations: 18,
    detections: 5,
    joinedDate: 'Feb 20, 2026',
  },
  {
    id: 4,
    name: 'Sunita Devi',
    location: 'Haryana',
    phone: '+91 98765 43213',
    email: 'sunita.d@example.com',
    farmSize: '12 acres',
    crops: ['Wheat', 'Mustard'],
    recommendations: 27,
    detections: 9,
    joinedDate: 'Mar 1, 2026',
  },
  {
    id: 5,
    name: 'Vijay Singh',
    location: 'Uttar Pradesh',
    phone: '+91 98765 43214',
    email: 'vijay.s@example.com',
    farmSize: '20 acres',
    crops: ['Sugarcane', 'Rice'],
    recommendations: 42,
    detections: 15,
    joinedDate: 'Mar 10, 2026',
  },
];

function StatCard({ label, value, color }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -5 }}
      className="bg-slate-900/60 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6"
    >
      <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl mb-4`} />
      <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
      <p className="text-slate-400 text-sm">{label}</p>
    </motion.div>
  );
}

export function FarmerManagement() {
  const { language } = useLanguage();
  const copy = getLocalizedCopy(language, FARMER_MANAGEMENT_COPY);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredFarmers = FARMERS.filter(farmer =>
    farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.location.toLowerCase().includes(searchTerm.toLowerCase())
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label={copy.stats[0]} value="2,847" color="from-blue-500 to-cyan-500" />
        <StatCard label={copy.stats[1]} value="1,234" color="from-emerald-500 to-green-500" />
        <StatCard label={copy.stats[2]} value="156" color="from-purple-500 to-pink-500" />
        <StatCard label={copy.stats[3]} value="15,420 acres" color="from-orange-500 to-amber-500" />
      </div>

      {/* Search and Filter */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder={copy.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white focus:border-emerald-500 focus:outline-none transition-colors"
            />
          </div>

          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:outline-none transition-colors"
          >
            <option value="all">{copy.filters.all}</option>
            <option value="active">{copy.filters.active}</option>
            <option value="new">{copy.filters.new}</option>
          </select>
        </div>
      </div>

      {/* Farmers Table */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-emerald-500/20 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-emerald-500/20">
              <tr>
                <th className="text-left px-6 py-4 text-emerald-400 font-semibold">{copy.table.farmer}</th>
                <th className="text-left px-6 py-4 text-emerald-400 font-semibold">{copy.table.location}</th>
                <th className="text-left px-6 py-4 text-emerald-400 font-semibold">{copy.table.farmSize}</th>
                <th className="text-left px-6 py-4 text-emerald-400 font-semibold">{copy.table.crops}</th>
                <th className="text-left px-6 py-4 text-emerald-400 font-semibold">{copy.table.activity}</th>
                <th className="text-left px-6 py-4 text-emerald-400 font-semibold">{copy.table.joined}</th>
                <th className="text-left px-6 py-4 text-emerald-400 font-semibold">{copy.table.actions}</th>
              </tr>
            </thead>
            <tbody>
              {filteredFarmers.map((farmer, index) => (
                <motion.tr
                  key={farmer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ backgroundColor: 'rgba(16, 185, 129, 0.05)' }}
                  className="border-b border-slate-800 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">
                          {farmer.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-semibold">{farmer.name}</p>
                        <p className="text-slate-400 text-sm flex items-center gap-1">
                          <Mail size={12} />
                          {farmer.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-300">
                      <MapPin size={16} className="text-emerald-400" />
                      {farmer.location}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white">{farmer.farmSize}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {farmer.crops.map(crop => (
                        <span
                          key={crop}
                          className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-lg text-xs font-semibold"
                        >
                          {crop}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-slate-300 text-sm">
                        <span className="text-emerald-400 font-semibold">{farmer.recommendations}</span> {copy.table.recommendations}
                      </p>
                      <p className="text-slate-300 text-sm">
                        <span className="text-purple-400 font-semibold">{farmer.detections}</span> {copy.table.detections}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-400 text-sm">{farmer.joinedDate}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                      >
                        <Eye size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between bg-slate-900/60 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-4">
        <p className="text-slate-400 text-sm">{copy.pagination.summary}</p>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg hover:bg-slate-700 transition-colors">
            {copy.pagination.previous}
          </button>
          <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
            {copy.pagination.next}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
