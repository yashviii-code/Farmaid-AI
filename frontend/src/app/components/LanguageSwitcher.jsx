import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function LanguageSwitcher() {
  const { language, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'english', label: 'English', flag: '🇬🇧' },
    { code: 'hindi', label: 'हिन्दी', flag: '🇮🇳' },
    { code: 'gujarati', label: 'ગુજરાતી', flag: '🇮🇳' },
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all"
      >
        <Globe size={18} />
        <span className="text-sm font-medium">{currentLanguage?.flag} {currentLanguage?.label}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown size={16} />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 bg-slate-900 border border-emerald-500/30 rounded-xl shadow-2xl overflow-hidden z-50"
          >
            {languages.map((lang) => (
              <motion.button
                key={lang.code}
                onClick={() => {
                  changeLanguage(lang.code);
                  setIsOpen(false);
                }}
                whileHover={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}
                className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                  language === lang.code
                    ? 'bg-emerald-500/20 text-emerald-400 border-l-2 border-emerald-500'
                    : 'text-gray-300 hover:text-emerald-400'
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="font-medium">{lang.label}</span>
                {language === lang.code && (
                  <motion.div
                    layoutId="selectedLanguage"
                    className="ml-auto w-2 h-2 bg-emerald-400 rounded-full"
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40"
        />
      )}
    </div>
  );
}
