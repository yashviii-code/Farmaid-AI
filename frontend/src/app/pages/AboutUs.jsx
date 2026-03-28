import { motion } from "motion/react";
import { Link } from "react-router";
import { Target, Eye, Heart, Users, Award, Globe, TrendingUp, ArrowLeft } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Navbar } from "../components/Navbar";
import { useLanguage } from "../context/LanguageContext";
import { getLocalizedCopy } from "../lib/getLocalizedCopy";

const ABOUT_EXTRA_COPY = {
  english: {
    storyBadge: "Our Story",
    valuesSubtitle: "What drives us every day",
    teamRoles: ["Chief AI Scientist", "Agriculture Expert", "Product Lead"],
    footerCopyright: "© 2026 FarmAid AI. All rights reserved.",
  },
  hindi: {
    storyBadge: "हमारी कहानी",
    valuesSubtitle: "जो हमें हर दिन प्रेरित करता है",
    teamRoles: ["मुख्य एआई वैज्ञानिक", "कृषि विशेषज्ञ", "उत्पाद प्रमुख"],
    footerCopyright: "© 2026 FarmAid AI. सर्वाधिकार सुरक्षित।",
  },
  gujarati: {
    storyBadge: "અમારી કહાની",
    valuesSubtitle: "જે અમને દરરોજ પ્રેરણા આપે છે",
    teamRoles: ["મુખ્ય એઆઇ વૈજ્ઞાનિક", "કૃષિ નિષ્ણાત", "ઉત્પાદન લીડ"],
    footerCopyright: "© 2026 FarmAid AI. સર્વ હક્ક સુરક્ષિત.",
  },
};

export function AboutUs() {
  const { t, language } = useLanguage();
  const extraCopy = getLocalizedCopy(language, ABOUT_EXTRA_COPY);

  const iconColors = [
    "from-red-500 to-pink-500",
    "from-yellow-500 to-orange-500",
    "from-blue-500 to-cyan-500",
    "from-green-500 to-emerald-500",
  ];

  const iconIcons = [Heart, Award, Globe, TrendingUp];

  const team = [
    {
      name: "Dr. Sarah Johnson",
      role: extraCopy.teamRoles[0],
      image: "https://images.unsplash.com/photo-1687473774629-b160f5012e9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyYWwlMjByZXNlYXJjaCUyMHNjaWVudGlzdHxlbnwxfHx8fDE3NzM3ODI2MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      name: "John Martinez",
      role: extraCopy.teamRoles[1],
      image: "https://images.unsplash.com/photo-1567471945805-069e09c11098?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyZSUyMHRlYW0lMjBmYXJtZXJzJTIwd29ya2luZ3xlbnwxfHx8fDE3NzM4Mzk2NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      name: "Emily Chen",
      role: extraCopy.teamRoles[2],
      image: "https://images.unsplash.com/photo-1768602182173-154eeedeed05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMGZhcm1pbmclMjBpbm5vdmF0aW9ufGVufDF8fHx8MTc3MzgzOTY0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
  ];

  return (
    <div className="min-h-screen dark:bg-gradient-to-b dark:from-slate-950 dark:via-green-950 dark:to-slate-950 from-blue-50 via-white to-blue-50 dark:text-white text-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none dark:block hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-green-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 2, 1],
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

      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 dark:text-green-400 dark:hover:text-green-300 text-green-600 hover:text-green-700 mb-8 group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            {t.aboutUs.backToHome}
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 dark:bg-gradient-to-r dark:from-green-500/20 dark:to-emerald-500/20 dark:border-green-500/30 bg-green-100 border-green-300 px-4 py-2 rounded-full backdrop-blur-sm mb-6 border"
            >
              <Users className="w-4 h-4 dark:text-green-400 text-green-600" />
              <span className="text-sm dark:text-green-400 text-green-700 font-medium">{extraCopy.storyBadge}</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="block dark:text-white text-slate-900 mb-2">{t.aboutUs.title}</span>
              <span className="bg-gradient-to-r dark:from-green-400 dark:via-emerald-400 dark:to-teal-400 from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {t.aboutUs.subtitle}
              </span>
            </h1>
            <p className="text-xl dark:text-gray-300 text-slate-700 max-w-3xl mx-auto leading-relaxed">
              {t.aboutUs.description}
            </p>
          </motion.div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative dark:bg-slate-900/80 bg-white/80 backdrop-blur-xl dark:border-green-500/20 border-green-200 rounded-3xl p-8 border">
                <Target className="w-12 h-12 dark:text-purple-400 text-purple-600 mb-4" />
                <h3 className="text-3xl font-bold dark:text-white text-slate-900 mb-4">{t.aboutUs.mission}</h3>
                <p className="dark:text-gray-300 text-slate-700 leading-relaxed">
                  {t.aboutUs.missionDesc}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative dark:bg-slate-900/80 bg-white/80 backdrop-blur-xl dark:border-green-500/20 border-green-200 rounded-3xl p-8 border">
                <Eye className="w-12 h-12 dark:text-blue-400 text-blue-600 mb-4" />
                <h3 className="text-3xl font-bold dark:text-white text-slate-900 mb-4">{t.aboutUs.vision}</h3>
                <p className="dark:text-gray-300 text-slate-700 leading-relaxed">
                  {t.aboutUs.visionDesc}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 dark:bg-gradient-to-b dark:from-transparent dark:via-green-500/5 dark:to-transparent from-green-50 via-green-50/50 to-transparent"></div>
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r dark:from-green-400 dark:to-emerald-400 from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {t.aboutUs.valuesTitle}
              </span>
            </h2>
            <p className="text-xl dark:text-gray-400 text-slate-600">{extraCopy.valuesSubtitle}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.aboutUs.values.map((value, index) => {
              const Icon = iconIcons[index];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="relative group"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${iconColors[index]} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity`}></div>
                  <div className="relative dark:bg-slate-900/80 bg-white/80 backdrop-blur-xl dark:border-green-500/20 border-green-200 rounded-2xl p-6 h-full dark:hover:border-green-500/50 hover:border-green-400 transition-all border">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${iconColors[index]} mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold dark:text-white text-slate-900 mb-3">{value.title}</h3>
                    <p className="dark:text-gray-400 text-slate-600">{value.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r dark:from-green-400 dark:to-emerald-400 from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {t.aboutUs.teamTitle}
              </span>
            </h2>
            <p className="text-xl dark:text-gray-400 text-slate-600">{t.aboutUs.teamSubtitle}</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative dark:bg-slate-900/80 bg-white/80 backdrop-blur-xl dark:border-green-500/20 border-green-200 rounded-2xl overflow-hidden dark:hover:border-green-500/50 hover:border-green-400 transition-all border">
                  <div className="relative h-64 overflow-hidden">
                    <ImageWithFallback
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 dark:bg-gradient-to-t dark:from-slate-900 bg-gradient-to-t from-white to-transparent"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold dark:text-white text-slate-900 mb-2">{member.name}</h3>
                    <p className="dark:text-green-400 text-green-600">{member.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r dark:from-green-400 dark:to-emerald-400 from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {t.aboutUs.milestones.title}
              </span>
            </h2>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 dark:bg-gradient-to-b dark:from-green-500 dark:to-emerald-500 from-green-700 to-emerald-700 bg-gradient-to-b"></div>
            
            {t.aboutUs.milestones.timeline.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`relative flex items-center mb-12 ${
                  index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                }`}
              >
                <div className={`w-1/2 ${index % 2 === 0 ? "text-right pr-8" : "text-left pl-8"}`}>
                  <div className="dark:bg-slate-900/80 bg-white/80 backdrop-blur-xl dark:border-green-500/20 border-green-200 rounded-xl p-6 dark:hover:border-green-500/50 hover:border-green-400 transition-all border">
                    <div className="text-3xl font-bold dark:text-green-400 text-green-600 mb-2">{milestone.year}</div>
                    <div className="text-xl dark:text-white text-slate-900">{milestone.event}</div>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full dark:border-4 dark:border-slate-950 border-4 border-white"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="dark:border-green-500/20 border-green-300 py-12 px-4 sm:px-6 lg:px-8 border-t">
        <div className="max-w-7xl mx-auto text-center dark:text-gray-400 text-slate-600">
          <p>{t.footer.tagline}</p>
          <p className="text-sm mt-4">{extraCopy.footerCopyright}</p>
        </div>
      </footer>
    </div>
  );
}
