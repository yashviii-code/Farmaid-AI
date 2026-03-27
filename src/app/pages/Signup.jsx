import { motion } from "motion/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowRight, CheckCircle2, Lock, Mail, Sparkles, User, UserPlus } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Logo } from "../components/Logo";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { getLocalizedCopy } from "../lib/getLocalizedCopy";

const SIGNUP_COPY = {
  english: {
    mobileTitle: "Create Account",
    hero: {
      titlePrefix: "Join the",
      titleHighlight: "Future of Farming",
      description:
        "Create your farmer account and unlock AI-powered crop insights, disease detection, and data-driven planning.",
    },
    featurePills: [
      "Personalized Crop Intelligence",
      "Real-time Field Insights",
      "Smart Farm Performance Tracking",
    ],
    form: {
      portal: "Farmer Registration",
      title: "Create Your Farmer Account",
      description: "Start your FarmAid AI journey in under a minute",
      fullNameLabel: "Full Name",
      fullNamePlaceholder: "Your full name",
      emailLabel: "Email Address",
      emailPlaceholder: "farmer@example.com",
      passwordLabel: "Password",
      confirmPasswordLabel: "Confirm Password",
      terms: "I agree to the Terms and Privacy Policy",
      submit: "Create Farmer Account",
      passwordMismatch: "Passwords do not match",
    },
    loginPrompt: "Already have an account?",
    loginLink: "Sign in",
    backToHomepage: "Back to Homepage",
  },
  hindi: {
    mobileTitle: "खाता बनाएं",
    hero: {
      titlePrefix: "जुड़ें",
      titleHighlight: "खेती के भविष्य से",
      description:
        "अपना किसान खाता बनाएं और एआई आधारित फसल सुझाव, रोग पहचान और डेटा आधारित योजना का लाभ उठाएं।",
    },
    featurePills: [
      "व्यक्तिगत फसल सुझाव",
      "रीयल-टाइम खेत जानकारी",
      "स्मार्ट खेती प्रदर्शन ट्रैकिंग",
    ],
    form: {
      portal: "किसान पंजीकरण",
      title: "अपना किसान खाता बनाएं",
      description: "एक मिनट में अपनी FarmAid AI यात्रा शुरू करें",
      fullNameLabel: "पूरा नाम",
      fullNamePlaceholder: "अपना पूरा नाम",
      emailLabel: "ईमेल पता",
      emailPlaceholder: "farmer@example.com",
      passwordLabel: "पासवर्ड",
      confirmPasswordLabel: "पासवर्ड की पुष्टि करें",
      terms: "मैं नियम और गोपनीयता नीति से सहमत हूं",
      submit: "किसान खाता बनाएं",
      passwordMismatch: "पासवर्ड मेल नहीं खाते",
    },
    loginPrompt: "क्या आपके पास पहले से खाता है?",
    loginLink: "साइन इन करें",
    backToHomepage: "होमपेज पर वापस जाएं",
  },
  gujarati: {
    mobileTitle: "એકાઉન્ટ બનાવો",
    hero: {
      titlePrefix: "જોડાઓ",
      titleHighlight: "ખેતીના ભવિષ્ય સાથે",
      description:
        "તમારું ખેડૂત એકાઉન્ટ બનાવો અને એઆઇ આધારિત પાક માર્ગદર્શન, રોગ શોધ અને ડેટા આધારિત આયોજન મેળવો.",
    },
    featurePills: [
      "વ્યક્તિગત પાક માર્ગદર્શન",
      "રીયલ-ટાઈમ ખેતર માહિતી",
      "સ્માર્ટ ખેતી પ્રદર્શન ટ્રેકિંગ",
    ],
    form: {
      portal: "ખેડૂત નોંધણી",
      title: "તમારું ખેડૂત એકાઉન્ટ બનાવો",
      description: "એક મિનિટમાં તમારી FarmAid AI યાત્રા શરૂ કરો",
      fullNameLabel: "પૂરૂં નામ",
      fullNamePlaceholder: "તમારું પૂરું નામ",
      emailLabel: "ઈમેઇલ સરનામું",
      emailPlaceholder: "farmer@example.com",
      passwordLabel: "પાસવર્ડ",
      confirmPasswordLabel: "પાસવર્ડની પુષ્ટિ કરો",
      terms: "હું નિયમો અને ગોપનીયતા નીતિ સાથે સંમત છું",
      submit: "ખેડૂત એકાઉન્ટ બનાવો",
      passwordMismatch: "પાસવર્ડ મેળ ખાતા નથી",
    },
    loginPrompt: "શું તમારું પહેલેથી એકાઉન્ટ છે?",
    loginLink: "સાઇન ઇન કરો",
    backToHomepage: "હોમપેજ પર પાછા જાઓ",
  },
};

export function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { language } = useLanguage();
  const copy = getLocalizedCopy(language, SIGNUP_COPY);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptedTerms: false,
  });
  const [error, setError] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError(copy.form.passwordMismatch);
      return;
    }

    setError("");
    login(form.email, form.password, "farmer");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br dark:from-slate-950 dark:via-green-950 dark:to-slate-950 from-blue-50 via-white to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
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

      <div className="relative w-full max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
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
              <p className="text-xl dark:text-gray-300 text-slate-700">{copy.hero.description}</p>
            </div>

            <div className="space-y-4">
              {[
                { icon: Sparkles, text: copy.featurePills[0] },
                { icon: CheckCircle2, text: copy.featurePills[1] },
                { icon: UserPlus, text: copy.featurePills[2] },
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

              <div className="mb-6">
                <div className="inline-flex items-center gap-2 dark:bg-green-500/10 dark:border-green-500/30 bg-green-100 border-green-300 px-4 py-2 rounded-full mb-4 border">
                  <User className="w-4 h-4 dark:text-green-400 text-green-600" />
                  <span className="text-sm dark:text-green-400 text-green-700">{copy.form.portal}</span>
                </div>
                <h3 className="text-2xl font-bold dark:text-white text-slate-900 mb-2">{copy.form.title}</h3>
                <p className="dark:text-gray-400 text-slate-600">{copy.form.description}</p>
              </div>

              <form onSubmit={handleSignup} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="dark:text-gray-300 text-slate-700">{copy.form.fullNameLabel}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 dark:text-gray-400 text-gray-500" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder={copy.form.fullNamePlaceholder}
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      className="pl-10 dark:bg-slate-800/50 dark:border-green-500/30 dark:focus:border-green-500 dark:text-white dark:placeholder:text-gray-500 bg-gray-50 border-green-200 focus:border-green-500 text-slate-900 placeholder:text-gray-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="dark:text-gray-300 text-slate-700">{copy.form.emailLabel}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 dark:text-gray-400 text-gray-500" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder={copy.form.emailPlaceholder}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="pl-10 dark:bg-slate-800/50 dark:border-green-500/30 dark:focus:border-green-500 dark:text-white dark:placeholder:text-gray-500 bg-gray-50 border-green-200 focus:border-green-500 text-slate-900 placeholder:text-gray-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="dark:text-gray-300 text-slate-700">{copy.form.passwordLabel}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 dark:text-gray-400 text-gray-500" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="pl-10 dark:bg-slate-800/50 dark:border-green-500/30 dark:focus:border-green-500 dark:text-white dark:placeholder:text-gray-500 bg-gray-50 border-green-200 focus:border-green-500 text-slate-900 placeholder:text-gray-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password" className="dark:text-gray-300 text-slate-700">{copy.form.confirmPasswordLabel}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 dark:text-gray-400 text-gray-500" />
                    <Input
                      id="signup-confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      className="pl-10 dark:bg-slate-800/50 dark:border-green-500/30 dark:focus:border-green-500 dark:text-white dark:placeholder:text-gray-500 bg-gray-50 border-green-200 focus:border-green-500 text-slate-900 placeholder:text-gray-500"
                      required
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 dark:text-gray-400 text-slate-600 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.acceptedTerms}
                    onChange={(e) => setForm({ ...form, acceptedTerms: e.target.checked })}
                    className="dark:border-gray-600 border-gray-300 rounded"
                    required
                  />
                  {copy.form.terms}
                </label>

                {error && (
                  <div className="dark:bg-red-500/10 dark:border-red-500/30 bg-red-100 border-red-300 rounded-xl p-3 border text-sm dark:text-red-400 text-red-700">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-6 text-lg rounded-xl group"
                >
                  {copy.form.submit}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>

              <p className="mt-6 text-center dark:text-gray-400 text-slate-600 text-sm">
                {copy.loginPrompt}{" "}
                <Link
                  to="/login"
                  className="dark:text-green-400 dark:hover:text-green-300 text-green-600 hover:text-green-700 font-semibold"
                >
                  {copy.loginLink}
                </Link>
              </p>

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
