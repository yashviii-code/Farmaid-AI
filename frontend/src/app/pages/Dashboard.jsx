import { motion } from "motion/react";
import { Link, useNavigate } from "react-router";
import { Sprout, Leaf, Camera, LogOut, TrendingUp, Award, Bell, Settings, User, ArrowRight, Sparkles, Brain } from "lucide-react";
import { Button } from "../components/ui/button";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Logo } from "../components/Logo";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { getLocalizedCopy } from "../lib/getLocalizedCopy";

const DASHBOARD_COPY = {
  english: {
    navLabel: "Dashboard",
    fallbackName: "John",
    fallbackFullName: "John Farmer",
    viewProfile: "View Profile",
    welcomeBack: "Welcome Back,",
    todayDescription: "Here's what you can do with FarmAid AI today",
    newFeaturesAvailable: "2 New Features Available",
    intro: {
      title: "Smart Farming Starts Here",
      description:
        "Welcome to your personalized farming dashboard. FarmAid AI is ready to help you make informed decisions about your crops. Whether you're looking for crop recommendations or disease detection, our advanced AI tools are here to support your farming journey and maximize your yield.",
      highlights: [
        {
          title: "Get Crop Recommendations",
          description: "AI-powered suggestions based on your soil and weather conditions",
        },
        {
          title: "Detect Plant Diseases",
          description: "Identify and treat diseases early with image recognition",
        },
      ],
    },
    toolsTitle: "AI-Powered Tools",
    cta: "Start Analysis",
    features: {
      crop: {
        title: "Crop Recommendation",
        description: "Get AI-powered crop suggestions based on soil nutrients, weather, and environmental conditions",
        stats: [
          { label: "Accuracy", value: "92%" },
          { label: "Crops", value: "50+" },
        ],
      },
      disease: {
        title: "Disease Detection",
        description: "Upload plant images for instant disease identification with treatment recommendations and prevention tips",
        stats: [
          { label: "Detection Rate", value: "95%" },
          { label: "Diseases", value: "100+" },
        ],
      },
    },
  },
  hindi: {
    navLabel: "डैशबोर्ड",
    fallbackName: "जॉन",
    fallbackFullName: "जॉन फार्मर",
    viewProfile: "प्रोफाइल देखें",
    welcomeBack: "फिर से स्वागत है,",
    todayDescription: "आज आप FarmAid AI के साथ यह कर सकते हैं",
    newFeaturesAvailable: "2 नई सुविधाएँ उपलब्ध हैं",
    intro: {
      title: "स्मार्ट खेती यहीं से शुरू होती है",
      description:
        "आपके व्यक्तिगत खेती डैशबोर्ड में स्वागत है। FarmAid AI आपकी फसलों के बारे में बेहतर निर्णय लेने में मदद करने के लिए तैयार है। चाहे आपको फसल सिफारिशें चाहिए हों या रोग पहचान, हमारे उन्नत एआई टूल आपकी खेती यात्रा को बेहतर बनाने और उपज बढ़ाने में मदद करेंगे।",
      highlights: [
        {
          title: "फसल सिफारिशें प्राप्त करें",
          description: "आपकी मिट्टी और मौसम की स्थिति पर आधारित एआई सुझाव",
        },
        {
          title: "पौधों के रोग पहचानें",
          description: "इमेज पहचान से रोगों की जल्दी पहचान और उपचार करें",
        },
      ],
    },
    toolsTitle: "एआई आधारित टूल्स",
    cta: "विश्लेषण शुरू करें",
    features: {
      crop: {
        title: "फसल सिफारिश",
        description: "मिट्टी के पोषक तत्वों, मौसम और पर्यावरणीय परिस्थितियों के आधार पर एआई-संचालित फसल सुझाव प्राप्त करें",
        stats: [
          { label: "सटीकता", value: "92%" },
          { label: "फसलें", value: "50+" },
        ],
      },
      disease: {
        title: "रोग पहचान",
        description: "उपचार सुझावों और रोकथाम टिप्स के साथ तुरंत रोग पहचान के लिए पौधे की छवियाँ अपलोड करें",
        stats: [
          { label: "पहचान दर", value: "95%" },
          { label: "रोग", value: "100+" },
        ],
      },
    },
  },
  gujarati: {
    navLabel: "ડેશબોર્ડ",
    fallbackName: "જોન",
    fallbackFullName: "જોન ફાર્મર",
    viewProfile: "પ્રોફાઇલ જુઓ",
    welcomeBack: "ફરીથી સ્વાગત છે,",
    todayDescription: "આજે તમે FarmAid AI સાથે આ કરી શકો છો",
    newFeaturesAvailable: "2 નવી સુવિધાઓ ઉપલબ્ધ છે",
    intro: {
      title: "સ્માર્ટ ખેતી અહીંથી શરૂ થાય છે",
      description:
        "તમારા વ્યક્તિગત ખેતી ડેશબોર્ડમાં સ્વાગત છે। FarmAid AI તમારી પાક સંબંધિત વધુ સારા નિર્ણયો લેવામાં મદદ કરવા માટે તૈયાર છે। પાક ભલામણો હોય કે રોગ ઓળખ, અમારા અદ્યતન એઆઇ ટૂલ્સ તમારી ખેતી યાત્રાને મજબૂત બનાવશે અને ઉત્પાદન વધારવામાં મદદ કરશે.",
      highlights: [
        {
          title: "પાક ભલામણો મેળવો",
          description: "તમારી માટી અને હવામાન પર આધારિત એઆઇ સૂચનો",
        },
        {
          title: "વનસ્પતિ રોગ ઓળખો",
          description: "ઇમેજ ઓળખ દ્વારા રોગોને વહેલા ઓળખો અને સારવાર કરો",
        },
      ],
    },
    toolsTitle: "એઆઇ આધારિત ટૂલ્સ",
    cta: "વિશ્લેષણ શરૂ કરો",
    features: {
      crop: {
        title: "પાક ભલામણ",
        description: "માટીના પોષક તત્વો, હવામાન અને પર્યાવરણ પર આધારિત એઆઇ દ્વારા પાક સૂચનો મેળવો",
        stats: [
          { label: "ચોકસાઈ", value: "92%" },
          { label: "પાકો", value: "50+" },
        ],
      },
      disease: {
        title: "રોગ ઓળખ",
        description: "ઉપચાર ભલામણો અને રોકથામ સૂચનો સાથે તાત્કાલિક રોગ ઓળખ માટે છોડની છબીઓ અપલોડ કરો",
        stats: [
          { label: "ઓળખ દર", value: "95%" },
          { label: "રોગો", value: "100+" },
        ],
      },
    },
  },
};

export function Dashboard() {
  const navigate = useNavigate();
  const { farmerProfile, logout } = useAuth();
  const { language } = useLanguage();
  const copy = getLocalizedCopy(language, DASHBOARD_COPY);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const features = [
    {
      title: copy.features.crop.title,
      description: copy.features.crop.description,
      icon: Leaf,
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-500/20 to-emerald-500/20",
      link: "/crop-recommendation",
      image: "https://images.unsplash.com/photo-1650223154381-cef156da1851?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwZ3JlZW4lMjBwbGFudHMlMjBncm93aW5nfGVufDF8fHx8MTc3MzgzOTM2MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      stats: copy.features.crop.stats,
    },
    {
      title: copy.features.disease.title,
      description: copy.features.disease.description,
      icon: Camera,
      gradient: "from-blue-500 to-purple-500",
      bgGradient: "from-blue-500/20 to-purple-500/20",
      link: "/disease-detection",
      image: "https://images.unsplash.com/photo-1694100223107-c898e5c117c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFudCUyMGRpc2Vhc2UlMjBsZWFmJTIwY2xvc2V1cHxlbnwxfHx8fDE3NzM4Mzk2NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      stats: copy.features.disease.stats,
    },
  ];



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-950 to-slate-950 text-white">
      {/* Animated Background */}
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

      {/* Navigation */}
      <nav className="relative z-10 bg-slate-950/80 backdrop-blur-xl border-b border-green-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <Link to="/">
                <Logo />
              </Link>
              <div className="pl-4 border-l border-green-500/20">
                <p className="text-xs text-gray-400 font-medium tracking-wider uppercase">{copy.navLabel}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-white hover:bg-slate-800"
              >
                <Bell className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-white hover:bg-slate-800"
                onClick={() => navigate("/settings")}
              >
                <Settings className="w-5 h-5" />
              </Button>
              <Link to="/profile" className="flex items-center gap-3 bg-slate-800/50 hover:bg-slate-800 transition-colors rounded-xl px-4 py-2 cursor-pointer">
                <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden border-2 border-green-500/50">
                  {farmerProfile?.profileImage ? (
                    <img src={farmerProfile.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <div className="hidden md:block text-sm">
                  <div className="font-semibold text-white">{farmerProfile?.name || copy.fallbackFullName}</div>
                  <div className="text-xs text-green-400">{copy.viewProfile}</div>
                </div>
              </Link>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                {copy.welcomeBack} <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">{farmerProfile?.name?.split(" ")[0] || copy.fallbackName}</span>
              </h1>
              <p className="text-gray-400 text-lg">{copy.todayDescription}</p>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 px-4 py-2 rounded-full">
              <Sparkles className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">{copy.newFeaturesAvailable}</span>
            </div>
          </div>

          {/* Welcome Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 backdrop-blur-xl border border-green-500/20 rounded-2xl p-8 md:p-10">
              <h2 className="text-2xl font-bold text-white mb-4">{copy.intro.title}</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                {copy.intro.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">{copy.intro.highlights[0].title}</h4>
                    <p className="text-sm text-gray-400">{copy.intro.highlights[0].description}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">{copy.intro.highlights[1].title}</h4>
                    <p className="text-sm text-gray-400">{copy.intro.highlights[1].description}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Main Features */}
        <div className="mb-12">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-3xl font-bold mb-8 flex items-center gap-3"
          >
            <Brain className="w-8 h-8 text-green-400" />
            <span>{copy.toolsTitle}</span>
          </motion.h2>

          <div className="grid lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative"
              >
                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-3xl blur-2xl opacity-0 group-hover:opacity-30 transition-opacity`}></div>
                
                {/* Card */}
                <div className="relative bg-slate-900/80 backdrop-blur-xl border border-green-500/20 rounded-3xl overflow-hidden hover:border-green-500/50 transition-all h-full">
                  {/* Image Header */}
                  <div className="relative h-48 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-r ${feature.bgGradient}`}></div>
                    <ImageWithFallback
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                    
                    {/* Floating Icon */}
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className={`absolute top-4 right-4 bg-gradient-to-r ${feature.gradient} p-4 rounded-2xl shadow-2xl`}
                    >
                      <feature.icon className="w-8 h-8 text-white" />
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <h3 className="text-3xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed mb-6">
                      {feature.description}
                    </p>

                    {/* Stats */}
                    <div className="flex gap-4 mb-6">
                      {feature.stats.map((stat, statIndex) => (
                        <div key={statIndex} className="flex-1 bg-slate-800/50 rounded-xl p-3">
                          <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                            {stat.value}
                          </div>
                          <div className="text-xs text-gray-400">{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <Link to={feature.link}>
                      <Button className={`w-full bg-gradient-to-r ${feature.gradient} hover:shadow-lg hover:shadow-green-500/50 text-white py-6 text-lg rounded-xl group/btn transition-all`}>
                        <span className="flex items-center justify-center gap-2">
                          {copy.cta}
                          <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                        </span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>


      </div>
    </div>
  );
}
