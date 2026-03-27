import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Sprout,
  Users,
  ScrollText,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedCopy } from '../lib/getLocalizedCopy';
import { useNavigate } from 'react-router';

const ADMIN_LAYOUT_COPY = {
  english: {
    panelLabel: 'Admin Panel',
    logout: 'Logout',
    nav: {
      dashboard: 'Dashboard',
      farmers: 'Farmer Management',
      logs: 'Logs & Monitoring',
      profile: 'Profile',
      settings: 'Settings',
    },
  },
  hindi: {
    panelLabel: 'एडमिन पैनल',
    logout: 'लॉगआउट',
    nav: {
      dashboard: 'डैशबोर्ड',
      farmers: 'किसान प्रबंधन',
      logs: 'लॉग्स और मॉनिटरिंग',
      profile: 'प्रोफाइल',
      settings: 'सेटिंग्स',
    },
  },
  gujarati: {
    panelLabel: 'એડમિન પેનલ',
    logout: 'લૉગઆઉટ',
    nav: {
      dashboard: 'ડેશબોર્ડ',
      farmers: 'ખેડૂત વ્યવસ્થાપન',
      logs: 'લૉગ્સ અને મોનીટરીંગ',
      profile: 'પ્રોફાઇલ',
      settings: 'સેટિંગ્સ',
    },
  },
};

export function AdminLayout() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { language } = useLanguage();
  const copy = getLocalizedCopy(language, ADMIN_LAYOUT_COPY);
  const normalizedPath = location.pathname.replace(/\/+$/, '') || '/';
  const navItems = [
    { icon: LayoutDashboard, label: copy.nav.dashboard, path: '/admin-dashboard' },
    { icon: Users, label: copy.nav.farmers, path: '/admin-dashboard/farmers' },
    { icon: ScrollText, label: copy.nav.logs, path: '/admin-dashboard/logs' },
    { icon: User, label: copy.nav.profile, path: '/admin-dashboard/profile' },
    { icon: Settings, label: copy.nav.settings, path: '/admin-dashboard/settings' },
  ];

  const isNavItemActive = (itemPath) => {
    if (itemPath === '/admin-dashboard') {
      return normalizedPath === itemPath;
    }

    return normalizedPath === itemPath || normalizedPath.startsWith(itemPath + '/');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-emerald-600 p-2 rounded-lg text-white hover:bg-emerald-700 transition-colors"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isExpanded ? 280 : 80,
        }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className={`fixed left-0 top-0 h-screen bg-slate-900/80 backdrop-blur-xl border-r border-emerald-500/20 z-40 transition-transform lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-emerald-500/20">
            <AnimatePresence mode="wait">
              {isExpanded ? (
                <motion.div
                  key="expanded"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-600 rounded-xl flex items-center justify-center">
                    <Sprout className="text-white" size={24} />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">FarmAid AI</h1>
                    <p className="text-xs text-emerald-400">{copy.panelLabel}</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="collapsed"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-600 rounded-xl flex items-center justify-center mx-auto"
                >
                  <Sprout className="text-white" size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-8 px-4 overflow-y-auto">
            <div className="space-y-2">
              {navItems.map((item) => {
                const isActive = isNavItemActive(item.path);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        relative flex items-center gap-4 px-4 py-3.5 rounded-xl cursor-pointer
                        transition-all duration-300 group
                        ${
                          isActive
                            ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'text-slate-400 hover:bg-slate-800/50 hover:text-emerald-300'
                        }
                      `}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-xl border border-emerald-500/30"
                          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                        />
                      )}

                      <Icon
                        size={22}
                        className={`relative z-10 ${
                          isActive ? 'text-emerald-400' : ''
                        }`}
                      />

                      <AnimatePresence mode="wait">
                        {isExpanded && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="relative z-10 font-medium"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute right-0 w-1 h-8 bg-gradient-to-b from-emerald-400 to-green-500 rounded-l-full"
                        />
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-emerald-500/20">
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center gap-3 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 transition-colors"
            >
              <LogOut size={20} />
              {isExpanded && <span className="font-medium">{copy.logout}</span>}
            </motion.button>
          </div>

          {/* Toggle Button */}
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden lg:flex items-center justify-center m-4 p-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-400 transition-colors"
          >
            {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </motion.button>
        </div>
      </motion.aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.main
        initial={false}
        animate={{
          marginLeft: isExpanded ? 280 : 80,
        }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="min-h-screen lg:ml-0 ml-0"
      >
        <div className="p-8 pt-20 lg:pt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <Outlet />
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
}
