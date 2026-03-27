import { motion } from "motion/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Sprout, User, Shield, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Logo } from "../components/Logo";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { getLocalizedCopy } from "../lib/getLocalizedCopy";

const LOGIN_COPY = {
  english: {
    mobileTitle: "Sign In",
    hero: {
      titlePrefix: "Welcome Back to the",
      titleHighlight: "Future of Farming",
      description: "Access powerful AI tools to optimize your agricultural operations and maximize yields.",
    },
    featurePills: [
      "AI-Powered Crop Recommendations",
      "Advanced Disease Detection",
      "Personalized Dashboard",
    ],
    tabs: { farmer: "Farmer", admin: "Admin" },
    farmer: {
      portal: "Farmer Portal",
      title: "Welcome Farmer!",
      description: "Access your personalized farming dashboard",
      emailLabel: "Email Address",
      emailPlaceholder: "farmer@example.com",
      passwordLabel: "Password",
      rememberMe: "Remember me",
      forgotPassword: "Forgot password?",
      submit: "Sign In as Farmer",
      signUpPrompt: "Don't have an account?",
      signUpLink: "Sign up",
    },
    admin: {
      portal: "Admin Portal",
      title: "Admin Access",
      description: "Manage and oversee platform operations",
      emailLabel: "Admin Email",
      emailPlaceholder: "admin@farmaid.ai",
      passwordLabel: "Password",
      securityNote: "Admin access requires additional security verification",
      submit: "Sign In as Admin",
      supportPrompt: "Need admin access?",
      supportLink: "Contact support",
    },
    backToHomepage: "Back to Homepage",
  },
  hindi: {
    mobileTitle: "साइन इन करें",
    hero: {
      titlePrefix: "वापस स्वागत है",
      titleHighlight: "भविष्य की खेती में",
      description: "अपनी कृषि गतिविधियों को बेहतर बनाने और उपज बढ़ाने के लिए शक्तिशाली एआई टूल्स का उपयोग करें।",
    },
    featurePills: [
      "एआई आधारित फसल सिफारिशें",
      "उन्नत रोग पहचान",
      "व्यक्तिगत डैशबोर्ड",
    ],
    tabs: { farmer: "किसान", admin: "एडमिन" },
    farmer: {
      portal: "किसान पोर्टल",
      title: "स्वागत है किसान!",
      description: "अपने व्यक्तिगत खेती डैशबोर्ड तक पहुंचें",
      emailLabel: "ईमेल पता",
      emailPlaceholder: "farmer@example.com",
      passwordLabel: "पासवर्ड",
      rememberMe: "मुझे याद रखें",
      forgotPassword: "पासवर्ड भूल गए?",
      submit: "किसान के रूप में साइन इन करें",
      signUpPrompt: "क्या आपका खाता नहीं है?",
      signUpLink: "साइन अप करें",
    },
    admin: {
      portal: "एडमिन पोर्टल",
      title: "एडमिन एक्सेस",
      description: "प्लेटफ़ॉर्म संचालन का प्रबंधन और निगरानी करें",
      emailLabel: "एडमिन ईमेल",
      emailPlaceholder: "admin@farmaid.ai",
      passwordLabel: "पासवर्ड",
      securityNote: "एडमिन एक्सेस के लिए अतिरिक्त सुरक्षा सत्यापन आवश्यक है",
      submit: "एडमिन के रूप में साइन इन करें",
      supportPrompt: "एडमिन एक्सेस चाहिए?",
      supportLink: "सपोर्ट से संपर्क करें",
    },
    backToHomepage: "होमपेज पर वापस जाएं",
  },
  gujarati: {
    mobileTitle: "સાઇન ઇન",
    hero: {
      titlePrefix: "ફરીથી સ્વાગત છે",
      titleHighlight: "ખેતીના ભવિષ્યમાં",
      description: "તમારી કૃષિ કામગીરીને વધુ સારી બનાવવા અને ઉત્પાદન વધારવા માટે શક્તિશાળી એઆઇ ટૂલ્સનો ઉપયોગ કરો.",
    },
    featurePills: [
      "એઆઇ આધારિત પાક ભલામણો",
      "અદ્યતન રોગ ઓળખ",
      "વ્યક્તિગત ડેશબોર્ડ",
    ],
    tabs: { farmer: "ખેડૂત", admin: "એડમિન" },
    farmer: {
      portal: "ખેડૂત પોર્ટલ",
      title: "સ્વાગત છે ખેડૂત!",
      description: "તમારા વ્યક્તિગત ખેતી ડેશબોર્ડ સુધી પહોંચો",
      emailLabel: "ઇમેઇલ સરનામું",
      emailPlaceholder: "farmer@example.com",
      passwordLabel: "પાસવર્ડ",
      rememberMe: "મને યાદ રાખો",
      forgotPassword: "પાસવર્ડ ભૂલી ગયા?",
      submit: "ખેડૂત તરીકે સાઇન ઇન કરો",
      signUpPrompt: "શું તમારું એકાઉન્ટ નથી?",
      signUpLink: "સાઇન અપ કરો",
    },
    admin: {
      portal: "એડમિન પોર્ટલ",
      title: "એડમિન ઍક્સેસ",
      description: "પ્લેટફોર્મ કામગીરીનું સંચાલન અને નિરીક્ષણ કરો",
      emailLabel: "એડમિન ઇમેઇલ",
      emailPlaceholder: "admin@farmaid.ai",
      passwordLabel: "પાસવર્ડ",
      securityNote: "એડમિન ઍક્સેસ માટે વધારાની સુરક્ષા ચકાસણી જરૂરી છે",
      submit: "એડમિન તરીકે સાઇન ઇન કરો",
      supportPrompt: "એડમિન ઍક્સેસ જોઈએ છે?",
      supportLink: "સપોર્ટનો સંપર્ક કરો",
    },
    backToHomepage: "હોમપેજ પર પાછા જાઓ",
  },
};

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { language } = useLanguage();
  const copy = getLocalizedCopy(language, LOGIN_COPY);
  const [farmerForm, setFarmerForm] = useState({ email: "", password: "" });
  const [adminForm, setAdminForm] = useState({ email: "", password: "" });

  const handleFarmerLogin = (e) => {
    e.preventDefault();
    login(farmerForm.email, farmerForm.password, "farmer");
    navigate("/dashboard");
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    login(adminForm.email, adminForm.password, "admin");
    navigate("/admin-dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br dark:from-slate-950 dark:via-green-950 dark:to-slate-950 from-blue-50 via-white to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none dark:block hidden">
        <div className="absolute inset-0">
          {[...Array(40)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            >
              <motion.div
                className="w-1 h-1 bg-green-400/30 rounded-full"
                animate={{
                  scale: [1, 2, 1],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Gradient Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-green-500/30 to-emerald-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative w-full max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block space-y-8"
          >
            <Link to="/" className="inline-flex items-center gap-3 group">
              <Logo className="scale-125 origin-left" textClassName="text-3xl" />
            </Link>

            <div className="space-y-6">
              <h1 className="text-5xl font-bold dark:text-white text-slate-900 leading-tight">
                {copy.hero.titlePrefix}
                <span className="block bg-gradient-to-r dark:from-green-400 dark:via-emerald-400 dark:to-teal-400 from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {copy.hero.titleHighlight}
                </span>
              </h1>
              <p className="text-xl dark:text-gray-300 text-slate-700">
                {copy.hero.description}
              </p>
            </div>

            {/* Feature Pills */}
            <div className="space-y-4">
              {[
                { icon: Sparkles, text: copy.featurePills[0] },
                { icon: Shield, text: copy.featurePills[1] },
                { icon: User, text: copy.featurePills[2] },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3 dark:bg-slate-900/50 dark:border-green-500/20 bg-white/70 border-green-200 backdrop-blur-sm border rounded-xl p-4"
                >
                  <div className="bg-gradient-to-r dark:from-green-500 dark:to-emerald-500 from-green-600 to-emerald-600 p-2 rounded-lg">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="dark:text-gray-300 text-slate-700">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 dark:bg-gradient-to-r dark:from-green-500 dark:to-emerald-500 bg-gradient-to-r from-green-200 to-emerald-200 rounded-3xl blur-xl dark:opacity-20 opacity-30"></div>
            <div className="relative dark:bg-slate-900/80 dark:border-green-500/20 bg-white/90 border-green-200 backdrop-blur-2xl border rounded-3xl p-8 shadow-2xl dark:shadow-none">
              <div className="text-center mb-8 lg:hidden">
                <Link to="/" className="inline-flex items-center gap-2 mb-4 justify-center">
                  <Logo />
                </Link>
                <h2 className="text-3xl font-bold dark:text-white text-slate-900">{copy.mobileTitle}</h2>
              </div>

              <Tabs defaultValue="farmer" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 dark:bg-slate-800/50 bg-gray-100 p-1">
                  <TabsTrigger
                    value="farmer"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white transition-all rounded-lg dark:text-gray-300 text-slate-700"
                  >
                    <User className="w-4 h-4 mr-2" />
                    {copy.tabs.farmer}
                  </TabsTrigger>
                  <TabsTrigger
                    value="admin"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all rounded-lg dark:text-gray-300 text-slate-700"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    {copy.tabs.admin}
                  </TabsTrigger>
                </TabsList>

                {/* Farmer Login */}
                <TabsContent value="farmer">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="mb-6">
                      <div className="inline-flex items-center gap-2 dark:bg-green-500/10 dark:border-green-500/30 bg-green-100 border-green-300 px-4 py-2 rounded-full mb-4 border">
                        <User className="w-4 h-4 dark:text-green-400 text-green-600" />
                        <span className="text-sm dark:text-green-400 text-green-700">{copy.farmer.portal}</span>
                      </div>
                      <h3 className="text-2xl font-bold dark:text-white text-slate-900 mb-2">{copy.farmer.title}</h3>
                      <p className="dark:text-gray-400 text-slate-600">{copy.farmer.description}</p>
                    </div>

                    <form onSubmit={handleFarmerLogin} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="farmer-email" className="dark:text-gray-300 text-slate-700">{copy.farmer.emailLabel}</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 dark:text-gray-400 text-gray-500" />
                          <Input
                            id="farmer-email"
                            type="email"
                            placeholder={copy.farmer.emailPlaceholder}
                            value={farmerForm.email}
                            onChange={(e) => setFarmerForm({ ...farmerForm, email: e.target.value })}
                            className="pl-10 dark:bg-slate-800/50 dark:border-green-500/30 dark:focus:border-green-500 dark:text-white dark:placeholder:text-gray-500 bg-gray-50 border-green-200 focus:border-green-500 text-slate-900 placeholder:text-gray-500"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="farmer-password" className="dark:text-gray-300 text-slate-700">{copy.farmer.passwordLabel}</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 dark:text-gray-400 text-gray-500" />
                          <Input
                            id="farmer-password"
                            type="password"
                            placeholder="••••••••"
                            value={farmerForm.password}
                            onChange={(e) => setFarmerForm({ ...farmerForm, password: e.target.value })}
                            className="pl-10 dark:bg-slate-800/50 dark:border-green-500/30 dark:focus:border-green-500 dark:text-white dark:placeholder:text-gray-500 bg-gray-50 border-green-200 focus:border-green-500 text-slate-900 placeholder:text-gray-500"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 dark:text-gray-400 text-slate-600 cursor-pointer">
                          <input type="checkbox" className="dark:border-gray-600 border-gray-300 rounded" />
                          {copy.farmer.rememberMe}
                        </label>
                        <a href="#" className="dark:text-green-400 dark:hover:text-green-300 text-green-600 hover:text-green-700">{copy.farmer.forgotPassword}</a>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-6 text-lg rounded-xl group"
                      >
                        {copy.farmer.submit}
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </form>

                    <p className="mt-6 text-center dark:text-gray-400 text-slate-600 text-sm">
                      {copy.farmer.signUpPrompt}{" "}
                      <a href="#" className="dark:text-green-400 dark:hover:text-green-300 text-green-600 hover:text-green-700 font-semibold">{copy.farmer.signUpLink}</a>
                    </p>
                  </motion.div>
                </TabsContent>

                {/* Admin Login */}
                <TabsContent value="admin">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="mb-6">
                      <div className="inline-flex items-center gap-2 dark:bg-blue-500/10 dark:border-blue-500/30 bg-blue-100 border-blue-300 px-4 py-2 rounded-full mb-4 border">
                        <Shield className="w-4 h-4 dark:text-blue-400 text-blue-600" />
                        <span className="text-sm dark:text-blue-400 text-blue-700">{copy.admin.portal}</span>
                      </div>
                      <h3 className="text-2xl font-bold dark:text-white text-slate-900 mb-2">{copy.admin.title}</h3>
                      <p className="dark:text-gray-400 text-slate-600">{copy.admin.description}</p>
                    </div>

                    <form onSubmit={handleAdminLogin} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="admin-email" className="dark:text-gray-300 text-slate-700">{copy.admin.emailLabel}</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 dark:text-gray-400 text-gray-500" />
                          <Input
                            id="admin-email"
                            type="email"
                            placeholder={copy.admin.emailPlaceholder}
                            value={adminForm.email}
                            onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                            className="pl-10 dark:bg-slate-800/50 dark:border-blue-500/30 dark:focus:border-blue-500 dark:text-white dark:placeholder:text-gray-500 bg-gray-50 border-blue-200 focus:border-blue-500 text-slate-900 placeholder:text-gray-500"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="admin-password" className="dark:text-gray-300 text-slate-700">{copy.admin.passwordLabel}</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 dark:text-gray-400 text-gray-500" />
                          <Input
                            id="admin-password"
                            type="password"
                            placeholder="••••••••"
                            value={adminForm.password}
                            onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                            className="pl-10 dark:bg-slate-800/50 dark:border-blue-500/30 dark:focus:border-blue-500 dark:text-white dark:placeholder:text-gray-500 bg-gray-50 border-blue-200 focus:border-blue-500 text-slate-900 placeholder:text-gray-500"
                            required
                          />
                        </div>
                      </div>

                      <div className="dark:bg-yellow-500/10 dark:border-yellow-500/30 bg-yellow-100 border-yellow-300 rounded-xl p-4 border">
                        <p className="dark:text-yellow-400 text-yellow-700 text-sm flex items-start gap-2">
                          <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>{copy.admin.securityNote}</span>
                        </p>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-6 text-lg rounded-xl group"
                      >
                        {copy.admin.submit}
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </form>

                    <p className="mt-6 text-center dark:text-gray-400 text-slate-600 text-sm">
                      {copy.admin.supportPrompt}{" "}
                      <a href="#" className="dark:text-blue-400 dark:hover:text-blue-300 text-blue-600 hover:text-blue-700 font-semibold">{copy.admin.supportLink}</a>
                    </p>
                  </motion.div>
                </TabsContent>
              </Tabs>

              <div className="mt-8 pt-6 border-t border-gray-700">
                <Link to="/" className="flex items-center justify-center gap-2 text-gray-400 hover:text-green-400 transition-colors text-sm">
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  {copy.backToHomepage}
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
