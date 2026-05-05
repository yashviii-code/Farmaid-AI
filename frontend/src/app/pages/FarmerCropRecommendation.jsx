import { motion } from "motion/react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { CropRecommendation } from "./CropRecommendation";
import { useLanguage } from "../context/LanguageContext";
import { getLocalizedCopy } from "../lib/getLocalizedCopy";

const FARMER_CROP_RECOMMENDATION_COPY = {
  english: {
    backToDashboard: "Back to Dashboard",
  },
  hindi: {
    backToDashboard: "डैशबोर्ड पर वापस जाएं",
  },
  gujarati: {
    backToDashboard: "ડેશબોર્ડ પર પાછા જાઓ",
  },
};

export function FarmerCropRecommendation() {
  const { language } = useLanguage();
  const copy = getLocalizedCopy(language, FARMER_CROP_RECOMMENDATION_COPY);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-950 to-slate-950 text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-green-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative">
        <div className="border-b border-green-500/20 bg-slate-950/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              {copy.backToDashboard}
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <CropRecommendation />
        </div>
      </div>
    </div>
  );
}
