import { motion } from "motion/react";
import { Link } from "react-router";
import { Button } from "./ui/button";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "../context/LanguageContext";

export function Navbar() {
  const { t } = useLanguage();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-green-500/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <Logo />
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-300 hover:text-green-400 transition-colors">
              {t.nav.home}
            </Link>
            <Link to="/about" className="text-gray-300 hover:text-green-400 transition-colors">
              {t.nav.about}
            </Link>
            <LanguageSwitcher />
            <Link to="/login">
              <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6">
                {t.nav.signIn}
              </Button>
            </Link>
          </div>

          {/* Mobile Switchers */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
