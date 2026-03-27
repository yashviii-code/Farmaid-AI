import { motion } from "motion/react";
import { useState } from "react";
import { Link } from "react-router";
import { Upload, Camera, AlertCircle, CheckCircle, Info, X, ArrowLeft, Sparkles, TrendingDown, Activity } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { useLanguage } from "../context/LanguageContext";
import { getLocalizedCopy } from "../lib/getLocalizedCopy";
import { detectDisease } from "../api/disease.api";

const DISEASE_DETECTION_COPY = {
  english: {
    title: "Plant Disease Detection",
    subtitle: "AI-powered disease identification and treatment",
    backToDashboard: "Back to Dashboard",
    upload: {
      badge: "Advanced AI Detection",
      title: "Upload Plant Image",
      description: "Take a clear photo of the affected plant area",
      dropzoneTitle: "Click to upload or drag and drop",
      dropzoneSubtitle: "PNG, JPG, JPEG up to 10MB",
      chooseImage: "Choose Image",
      tipsTitle: "Tips for Best Results:",
      tips: [
        "Take photo in bright natural lighting",
        "Focus clearly on affected area",
        "Include visible disease symptoms",
        "Avoid blurry or dark images",
      ],
    },
    review: {
      title: "Image Ready for Analysis",
      description: "Review your image and start detection",
    },
    buttons: {
      detectDisease: "Detect Disease",
      analyzing: "Analyzing Image...",
      uploadDifferent: "Upload Different Image",
      analyzeAnother: "Analyze Another Plant",
    },
    results: {
      completeTitle: "Detection Complete!",
      completeDescription: "Disease identified with high confidence",
      confidence: "Confident",
      detectedDisease: "Detected Disease",
      severitySuffix: "Severity",
      symptomsTitle: "Identified Symptoms",
      treatmentTitle: "Treatment Recommendations",
      preventionTitle: "Prevention Tips",
      importantNote: "Important Note:",
      noteBody:
        "This is an AI-generated diagnosis. For severe infections or if you're unsure, please consult with a local agricultural expert or plant pathologist for professional advice.",
      backToDashboard: "Back to Dashboard",
    },
    fields: {
      pesticide: "Pesticide",
      dosage: "Dosage",
      frequency: "Frequency",
      defaultSymptom: "Plant pathology features recognized by AI Model",
      defaultPrevention: "No specific prevention data available.",
    },
    errors: {
      failedDetection: "Failed to detect disease.",
      backendUnavailable: "An error occurred. Make sure the backend server is running on port 5001.",
    },
  },
  hindi: {
    title: "पौध रोग पहचान",
    subtitle: "एआई आधारित रोग पहचान और उपचार",
    backToDashboard: "डैशबोर्ड पर वापस जाएं",
    upload: {
      badge: "उन्नत एआई पहचान",
      title: "पौधे की छवि अपलोड करें",
      description: "प्रभावित हिस्से की स्पष्ट फोटो लें",
      dropzoneTitle: "अपलोड करने के लिए क्लिक करें या ड्रैग एंड ड्रॉप करें",
      dropzoneSubtitle: "PNG, JPG, JPEG अधिकतम 10MB",
      chooseImage: "छवि चुनें",
      tipsTitle: "बेहतर परिणामों के लिए सुझाव:",
      tips: [
        "उज्ज्वल प्राकृतिक रोशनी में फोटो लें",
        "प्रभावित हिस्से पर स्पष्ट फोकस करें",
        "दिखाई देने वाले रोग लक्षण शामिल करें",
        "धुंधली या अंधेरी छवियों से बचें",
      ],
    },
    review: {
      title: "विश्लेषण के लिए छवि तैयार है",
      description: "अपनी छवि की समीक्षा करें और पहचान शुरू करें",
    },
    buttons: {
      detectDisease: "रोग पहचानें",
      analyzing: "छवि का विश्लेषण हो रहा है...",
      uploadDifferent: "दूसरी छवि अपलोड करें",
      analyzeAnother: "दूसरे पौधे का विश्लेषण करें",
    },
    results: {
      completeTitle: "पहचान पूरी हुई!",
      completeDescription: "उच्च विश्वास के साथ रोग की पहचान हुई",
      confidence: "विश्वास",
      detectedDisease: "पहचाना गया रोग",
      severitySuffix: "गंभीरता",
      symptomsTitle: "पहचाने गए लक्षण",
      treatmentTitle: "उपचार सिफारिशें",
      preventionTitle: "रोकथाम सुझाव",
      importantNote: "महत्वपूर्ण नोट:",
      noteBody:
        "यह एआई द्वारा तैयार निदान है। यदि संक्रमण गंभीर हो या आप निश्चित न हों, तो स्थानीय कृषि विशेषज्ञ या पौध रोग विशेषज्ञ से सलाह लें।",
      backToDashboard: "डैशबोर्ड पर वापस जाएं",
    },
    fields: {
      pesticide: "कीटनाशक",
      dosage: "मात्रा",
      frequency: "आवृत्ति",
      defaultSymptom: "एआई मॉडल द्वारा पौध रोग संबंधी विशेषताएँ पहचानी गईं",
      defaultPrevention: "विशिष्ट रोकथाम डेटा उपलब्ध नहीं है।",
    },
    errors: {
      failedDetection: "रोग की पहचान नहीं हो सकी।",
      backendUnavailable: "एक त्रुटि हुई। कृपया सुनिश्चित करें कि बैकएंड सर्वर पोर्ट 5001 पर चल रहा है।",
    },
  },
  gujarati: {
    title: "વનસ્પતિ રોગ ઓળખ",
    subtitle: "એઆઇ આધારિત રોગ ઓળખ અને સારવાર",
    backToDashboard: "ડેશબોર્ડ પર પાછા જાઓ",
    upload: {
      badge: "અદ્યતન એઆઇ શોધ",
      title: "છોડની છબી અપલોડ કરો",
      description: "અસરગ્રસ્ત ભાગનો સ્પષ્ટ ફોટો લો",
      dropzoneTitle: "અપલોડ કરવા ક્લિક કરો અથવા ડ્રેગ એન્ડ ડ્રોપ કરો",
      dropzoneSubtitle: "PNG, JPG, JPEG વધુમાં વધુ 10MB",
      chooseImage: "છબી પસંદ કરો",
      tipsTitle: "સારા પરિણામ માટે સૂચનો:",
      tips: [
        "પ્રકાશિત કુદરતી પ્રકાશમાં ફોટો લો",
        "અસરગ્રસ્ત ભાગ પર સ્પષ્ટ ફોકસ કરો",
        "દેખાતા રોગ લક્ષણો સમાવેશ કરો",
        "ધૂંધળી અથવા અંધારી છબીઓથી બચો",
      ],
    },
    review: {
      title: "વિશ્લેષણ માટે છબી તૈયાર છે",
      description: "તમારી છબી તપાસો અને ઓળખ શરૂ કરો",
    },
    buttons: {
      detectDisease: "રોગ ઓળખો",
      analyzing: "છબીનું વિશ્લેષણ થઈ રહ્યું છે...",
      uploadDifferent: "બીજી છબી અપલોડ કરો",
      analyzeAnother: "બીજા છોડનું વિશ્લેષણ કરો",
    },
    results: {
      completeTitle: "ઓળખ પૂર્ણ થઈ!",
      completeDescription: "રોગ ઊંચી વિશ્વસનીયતા સાથે ઓળખાયો",
      confidence: "વિશ્વાસ",
      detectedDisease: "ઓળખાયેલ રોગ",
      severitySuffix: "તીવ્રતા",
      symptomsTitle: "ઓળખાયેલા લક્ષણો",
      treatmentTitle: "ઉપચાર ભલામણો",
      preventionTitle: "રોકથામ સૂચનો",
      importantNote: "મહત્વપૂર્ણ નોંધ:",
      noteBody:
        "આ એઆઇ દ્વારા તૈયાર કરાયેલ નિદાન છે. ગંભીર સંક્રમણ હોય અથવા તમને ખાતરી ન હોય તો સ્થાનિક કૃષિ નિષ્ણાત અથવા પાંદડા રોગ નિષ્ણાતની સલાહ લો.",
      backToDashboard: "ડેશબોર્ડ પર પાછા જાઓ",
    },
    fields: {
      pesticide: "કીટનાશક",
      dosage: "માત્રા",
      frequency: "આવર્તન",
      defaultSymptom: "એઆઇ મોડેલ દ્વારા છોડના રોગલક્ષણો ઓળખાયા",
      defaultPrevention: "વિશેષ રોકથામ માહિતી ઉપલબ્ધ નથી.",
    },
    errors: {
      failedDetection: "રોગ ઓળખવામાં નિષ્ફળતા.",
      backendUnavailable: "ભૂલ આવી. ખાતરી કરો કે બેકએન્ડ સર્વર 5001 પોર્ટ પર ચાલુ છે.",
    },
  },
};

export function DiseaseDetection() {
  const { language } = useLanguage();
  const copy = getLocalizedCopy(language, DISEASE_DETECTION_COPY);
  const [selectedImage, setSelectedImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    setLoading(true);

    try {
      const res = await fetch(selectedImage);
      const blob = await res.blob();
      const data = await detectDisease(blob);

      if (data.success) {
        setResult({
          disease: data.disease,
          confidence: Math.round(data.confidence * 100),
          severity: data.severity,
          symptoms: [copy.fields.defaultSymptom],
          treatment: [
            `${copy.fields.pesticide}: ${data.treatment.pesticide}`,
            `${copy.fields.dosage}: ${data.treatment.dosage}`,
            `${copy.fields.frequency}: ${data.treatment.frequency}`
          ],
          prevention: data.prevention && data.prevention.length > 0 ? data.prevention : [copy.fields.defaultPrevention]
        });
      } else {
        alert(data.error || copy.errors.failedDetection);
      }
    } catch (error) {
      console.error("Analysis error:", error);
      alert(copy.errors.backendUnavailable);
    } finally {
      setLoading(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setResult(null);
  };

  const getSeverityConfig = (severity) => {
    switch (severity) {
      case "Low":
        return {
          color: "yellow",
          gradient: "from-yellow-500 to-orange-500",
          bg: "bg-yellow-500/10",
          border: "border-yellow-500/30",
          text: "text-yellow-400",
        };
      case "Medium":
        return {
          color: "orange",
          gradient: "from-orange-500 to-red-500",
          bg: "bg-orange-500/10",
          border: "border-orange-500/30",
          text: "text-orange-400",
        };
      case "High":
        return {
          color: "red",
          gradient: "from-red-500 to-pink-500",
          bg: "bg-red-500/10",
          border: "border-red-500/30",
          text: "text-red-400",
        };
      default:
        return {
          color: "gray",
          gradient: "from-gray-500 to-gray-600",
          bg: "bg-gray-500/10",
          border: "border-gray-500/30",
          text: "text-gray-400",
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative">
        {/* Header */}
        <div className="border-b border-blue-500/20 bg-slate-950/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              {copy.backToDashboard}
            </Link>
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-2xl"
              >
                <Camera className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {copy.title}
                </h1>
                <p className="text-gray-400">{copy.subtitle}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {!result ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="bg-slate-900/80 backdrop-blur-xl border-blue-500/20 shadow-2xl overflow-hidden">
                <CardContent className="p-8">
                  {!selectedImage ? (
                    <div className="space-y-8">
                      <div className="text-center">
                        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-4 py-2 rounded-full mb-4">
                          <Sparkles className="w-4 h-4 text-blue-400" />
                          <span className="text-sm text-blue-400">{copy.upload.badge}</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">{copy.upload.title}</h2>
                        <p className="text-gray-400">{copy.upload.description}</p>
                      </div>

                      {/* Upload Area */}
                      <label
                        htmlFor="image-upload"
                        className="relative block border-2 border-dashed border-blue-500/30 rounded-2xl p-16 text-center hover:border-blue-500/60 transition-all cursor-pointer group bg-gradient-to-br from-blue-500/5 to-purple-500/5"
                      >
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="sr-only"
                        />
                        <motion.div
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Upload className="w-20 h-20 text-blue-400/50 mx-auto mb-6 group-hover:text-blue-400 transition-colors" />
                        </motion.div>
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                          {copy.upload.dropzoneTitle}
                        </h3>
                        <p className="text-gray-400 mb-4">{copy.upload.dropzoneSubtitle}</p>
                        <div className="inline-flex items-center gap-2 bg-blue-500/20 px-6 py-3 rounded-xl">
                          <Camera className="w-5 h-5 text-blue-400" />
                          <span className="text-blue-400 font-semibold">{copy.upload.chooseImage}</span>
                        </div>
                      </label>

                      {/* Tips */}
                      <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-6">
                        <div className="flex items-start gap-3">
                          <Info className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-bold text-white mb-3">{copy.upload.tipsTitle}</h4>
                            <div className="grid sm:grid-cols-2 gap-3">
                              {copy.upload.tips.map((tip, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                                  <span>{tip}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="text-center">
                        <h2 className="text-2xl font-bold text-white mb-2">{copy.review.title}</h2>
                        <p className="text-gray-400">{copy.review.description}</p>
                      </div>

                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                        <div className="relative">
                          <img
                            src={selectedImage}
                            alt="Uploaded plant"
                            className="w-full h-96 object-cover rounded-2xl border-2 border-blue-500/20"
                          />
                          <button
                            onClick={clearImage}
                            className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl shadow-lg transition-all group/btn"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            onClick={handleAnalyze}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-7 text-lg rounded-xl shadow-lg shadow-blue-500/50 group"
                          >
                            {loading ? (
                              <span className="flex items-center gap-3">
                                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                {copy.buttons.analyzing}
                              </span>
                            ) : (
                              <span className="flex items-center gap-2">
                                <Activity className="w-5 h-5" />
                                {copy.buttons.detectDisease}
                                <ArrowLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                              </span>
                            )}
                          </Button>
                        </motion.div>

                        <Button
                          variant="outline"
                          onClick={clearImage}
                          className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10 py-6 rounded-xl"
                        >
                          {copy.buttons.uploadDifferent}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-5xl mx-auto space-y-6"
            >
              {/* Success Banner */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{copy.results.completeTitle}</h3>
                    <p className="text-blue-300">{copy.results.completeDescription}</p>
                  </div>
                  <div className="ml-auto bg-white text-blue-700 px-6 py-3 rounded-full font-bold text-lg">
                    {result.confidence}% {copy.results.confidence}
                  </div>
                </div>
              </motion.div>

              {/* Main Result Card */}
              <Card className="bg-slate-900/80 backdrop-blur-xl border-blue-500/30 shadow-2xl overflow-hidden">
                <div className={`bg-gradient-to-r ${getSeverityConfig(result.severity).gradient} p-8`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm mb-1">{copy.results.detectedDisease}</p>
                      <h2 className="text-5xl font-bold text-white mb-3">{result.disease}</h2>
                      <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                        <AlertCircle className="w-4 h-4 text-white" />
                        <span className="text-white font-semibold">{result.severity} {copy.results.severitySuffix}</span>
                      </div>
                    </div>
                    <div className="hidden md:block">
                      <TrendingDown className="w-16 h-16 text-white/30" />
                    </div>
                  </div>
                </div>

                <CardContent className="p-8 space-y-6">
                  {/* Symptoms */}
                  <div className={`${getSeverityConfig(result.severity).bg} border ${getSeverityConfig(result.severity).border} rounded-xl p-6`}>
                    <div className="flex items-start gap-3 mb-4">
                      <AlertCircle className={`w-6 h-6 ${getSeverityConfig(result.severity).text} mt-1 flex-shrink-0`} />
                      <h4 className="text-xl font-bold text-white">{copy.results.symptomsTitle}</h4>
                    </div>
                    <div className="grid gap-3">
                      {result.symptoms.map((symptom, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <div className={`${getSeverityConfig(result.severity).text} mt-1 font-bold`}>•</div>
                          <p className="text-gray-300">{symptom}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Treatment */}
                  <div>
                    <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
                      {copy.results.treatmentTitle}
                    </h4>
                    <div className="grid gap-3">
                      {result.treatment.map((step, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                          className="flex items-start gap-3 bg-orange-500/10 border border-orange-500/20 rounded-xl p-4"
                        >
                          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white text-sm font-bold">{index + 1}</span>
                          </div>
                          <p className="text-gray-300">{step}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Prevention */}
                  <div>
                    <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>
                      {copy.results.preventionTitle}
                    </h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {result.prevention.map((tip, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 + index * 0.1 }}
                          className="flex items-start gap-3 bg-green-500/10 border border-green-500/20 rounded-xl p-4"
                        >
                          <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-300 text-sm">{tip}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Warning */}
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-yellow-200">
                        <strong className="block mb-1">{copy.results.importantNote}</strong>
                        {copy.results.noteBody}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button
                      onClick={() => {
                        setResult(null);
                        setSelectedImage(null);
                      }}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-6 text-lg rounded-xl"
                    >
                      {copy.buttons.analyzeAnother}
                    </Button>
                    <Link to="/dashboard" className="flex-1">
                      <Button
                        variant="outline"
                        className="w-full border-blue-500 text-blue-400 hover:bg-blue-500/10 py-6 text-lg rounded-xl"
                      >
                        {copy.results.backToDashboard}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
