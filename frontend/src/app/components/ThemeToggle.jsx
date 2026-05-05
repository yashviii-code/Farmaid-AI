import { motion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700/50 hover:bg-slate-300 dark:hover:bg-slate-600/50 border border-slate-300 dark:border-slate-600/50 hover:border-slate-400 dark:hover:border-slate-500/50 transition-all duration-300 group shadow-md dark:shadow-none"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 0 : 180, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="absolute"
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5 text-amber-300" />
        ) : (
          <Moon className="w-5 h-5 text-slate-700" />
        )}
      </motion.div>
    </motion.button>
  );
}
