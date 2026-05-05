import { motion } from "motion/react";
import { Link } from "react-router";
import { Sprout, Sparkles, ArrowRight, Brain, Shield, Zap, Users, TrendingUp, Award, ChevronDown } from "lucide-react";
import { Button } from "../components/ui/button";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Navbar } from "../components/Navbar";
import { useLanguage } from "../context/LanguageContext";
import { getLocalizedCopy } from "../lib/getLocalizedCopy";

const LANDING_EXTRA_COPY = {
  english: {
    aiCard: { title: "AI Powered", description: "Smart Analysis" },
    accuracyCard: { title: "95% Accuracy", description: "Trusted Results" },
    footerCopyright: "© 2026 FarmAid AI. All rights reserved.",
  },
  hindi: {
    aiCard: { title: "एआई संचालित", description: "स्मार्ट विश्लेषण" },
    accuracyCard: { title: "95% सटीकता", description: "विश्वसनीय परिणाम" },
    footerCopyright: "© 2026 FarmAid AI. सर्वाधिकार सुरक्षित।",
  },
  gujarati: {
    aiCard: { title: "એઆઇ આધારિત", description: "સ્માર્ટ વિશ્લેષણ" },
    accuracyCard: { title: "95% ચોકસાઈ", description: "વિશ્વસનીય પરિણામો" },
    footerCopyright: "© 2026 FarmAid AI. સર્વ હક્ક સુરક્ષિત.",
  },
};

export function LandingPage() {
  const { t, language } = useLanguage();
  const extraCopy = getLocalizedCopy(language, LANDING_EXTRA_COPY);

  const floatingAnimation = {
    y: [0, -20, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  const features = [
    {
      icon: Brain,
      title: t.features.feature1.title,
      description: t.features.feature1.description,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Shield,
      title: t.features.feature2.title,
      description: t.features.feature2.description,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Zap,
      title: t.features.feature3.title,
      description: t.features.feature3.description,
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: TrendingUp,
      title: t.features.feature4.title,
      description: t.features.feature4.description,
      gradient: "from-green-500 to-emerald-500",
    },
  ];

  const stats = [
    { number: "50K+", label: t.stats.farmers, icon: Users },
    { number: "95%", label: t.stats.accuracy, icon: Award },
    { number: "100+", label: t.stats.crops, icon: Sprout },
    { number: "24/7", label: t.stats.support, icon: Shield },
  ];

  return (
    <div className="min-h-screen dark:bg-gradient-to-b dark:from-slate-950 dark:via-green-950 dark:to-slate-950 from-blue-50 via-white to-blue-50 dark:text-white text-slate-900 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none dark:block hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-green-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 dark:bg-gradient-to-r dark:from-green-500/20 dark:to-emerald-500/20 dark:border-green-500/30 bg-green-100 border-green-300 px-4 py-2 rounded-full backdrop-blur-sm border"
              >
                <Sparkles className="w-4 h-4 dark:text-green-400 text-green-600" />
                <span className="text-sm dark:text-green-400 text-green-700 font-medium">{t.hero.badge}</span>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                <span className="block bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 dark:from-green-400 dark:via-emerald-400 dark:to-teal-400 from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {t.hero.title}
                </span>
              </h1>

              <p className="text-xl dark:text-gray-300 text-slate-700 leading-relaxed">
                {t.hero.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login">
                  <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 dark:text-white text-white px-8 py-6 text-lg rounded-xl group">
                    {t.hero.getStarted}
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" className="dark:border-green-500 dark:text-green-400 dark:hover:bg-green-500/10 border-2 border-green-600 text-green-700 hover:bg-green-100 px-8 py-6 text-lg rounded-xl">
                    {t.hero.learnMore}
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-8 pt-4">
                {stats.slice(0, 2).map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-3xl font-bold dark:text-green-400 text-green-600">{stat.number}</div>
                    <div className="text-sm dark:text-gray-400 text-slate-600">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <motion.div animate={floatingAnimation} className="relative z-10">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl blur-3xl opacity-30"></div>
                <ImageWithFallback
                  src="/hero-farmer-3.png"
                  alt="Farmer thumbs up"
                  className="relative rounded-3xl shadow-2xl border border-green-500/20"
                />
              </motion.div>

              {/* Floating Cards */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -left-4 top-1/4 dark:bg-gradient-to-r dark:from-purple-500/90 dark:to-pink-500/90 bg-gradient-to-r from-purple-200/90 to-pink-200/90 backdrop-blur-xl p-4 rounded-2xl shadow-2xl dark:border-white/20 border-gray-300"
              >
                <Brain className="w-8 h-8 dark:text-white text-slate-900 mb-2" />
                <div className="dark:text-white text-slate-900 font-bold">{extraCopy.aiCard.title}</div>
                <div className="dark:text-white/80 text-slate-700 text-sm">{extraCopy.aiCard.description}</div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -right-4 bottom-1/4 dark:bg-gradient-to-r dark:from-blue-500/90 dark:to-cyan-500/90 bg-gradient-to-r from-blue-200/90 to-cyan-200/90 backdrop-blur-xl p-4 rounded-2xl shadow-2xl dark:border-white/20 border-gray-300"
              >
                <Shield className="w-8 h-8 dark:text-white text-slate-900 mb-2" />
                <div className="dark:text-white text-slate-900 font-bold">{extraCopy.accuracyCard.title}</div>
                <div className="dark:text-white/80 text-slate-700 text-sm">{extraCopy.accuracyCard.description}</div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown className="w-8 h-8 dark:text-green-400 text-green-600" />
        </motion.div>
      </section>

      {/* Features Section */}
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
                {t.features.title}
              </span>
            </h2>
            <p className="text-xl dark:text-gray-400 text-slate-600 max-w-2xl mx-auto">
              {t.features.subtitle}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity`}></div>
                <div className="relative dark:bg-slate-900/80 bg-white/80 backdrop-blur-xl dark:border-green-500/20 border-green-200 rounded-2xl p-6 h-full dark:hover:border-green-500/50 hover:border-green-400 transition-all border">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.gradient} mb-4`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold dark:text-white text-slate-900 mb-2">{feature.title}</h3>
                  <p className="dark:text-gray-400 text-slate-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="dark:bg-gradient-to-r dark:from-green-900/50 dark:to-emerald-900/50 bg-gradient-to-r from-green-100/50 to-emerald-100/50 backdrop-blur-xl dark:border-green-500/20 border-green-300 rounded-3xl p-12 border">
            <div className="grid md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <stat.icon className="w-12 h-12 dark:text-green-400 text-green-600 mx-auto mb-4" />
                  <div className="text-4xl font-bold bg-gradient-to-r dark:from-green-400 dark:to-emerald-400 from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="dark:text-gray-400 text-slate-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-6xl font-bold">
              <span className="block dark:text-white text-slate-900 mb-4">{t.cta.title}</span>
              <span className="bg-gradient-to-r dark:from-green-400 dark:via-emerald-400 dark:to-teal-400 from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {t.cta.subtitle}
              </span>
            </h2>

            <p className="text-xl dark:text-gray-400 text-slate-600 max-w-2xl mx-auto">
              {t.cta.description}
            </p>

            <Link to="/login">
              <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 dark:shadow-green-500/50 text-white px-12 py-6 text-lg rounded-xl shadow-lg group">
                {t.cta.button}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
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
