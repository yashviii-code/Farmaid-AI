import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { AlertCircle, ArrowLeft, Camera, ImagePlus, LoaderCircle, Upload } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { detectDisease } from "../api/disease.api";
import { useLanguage } from "../context/LanguageContext";
import { getLocalizedCopy } from "../lib/getLocalizedCopy";
import { translateDynamicValue } from "../lib/translate";

const DISEASE_COPY = {
  english: {
    backToDashboard: "Back to Dashboard",
    eyebrow: "AI plant health scan",
    title: "Disease Detection",
    subtitle: "Upload a clear leaf image and get the predicted disease with confidence.",
    uploadTitle: "Upload plant image",
    uploadDescription: "Supported formats: JPG, JPEG, PNG. Maximum file size: 10 MB.",
    chooseImage: "Choose image",
    selectedFile: "Selected file",
    previewTitle: "Image preview",
    readyTitle: "Ready to analyze",
    readyDescription: "We will send the image to the backend and show the predicted disease name with confidence.",
    detectDisease: "Detect disease",
    detecting: "Detecting disease...",
    uploadAnother: "Upload another image",
    resultTitle: "Detection result",
    diseaseLabel: "Disease",
    confidenceLabel: "Confidence",
    treatmentTitle: "Treatment",
    pesticideLabel: "Pesticide",
    dosageLabel: "Dosage",
    frequencyLabel: "Frequency",
    preventionTitle: "Prevention",
    noPrevention: "No prevention tips available.",
    debugTitle: "Debug payload",
    debugDescription: "Treatment details are missing in the response. This is the raw payload received from the backend.",
    emptyState: "Upload an image to start disease detection.",
    noFileError: "Please choose an image before submitting.",
    invalidTypeError: "Please upload a JPG, JPEG, or PNG image.",
    failedDetection: "Disease detection failed. Please try again.",
  },
  hindi: {
    backToDashboard: "डैशबोर्ड पर वापस जाएं",
    eyebrow: "एआई पौधा स्वास्थ्य स्कैन",
    title: "रोग पहचान",
    subtitle: "पत्ते की स्पष्ट तस्वीर अपलोड करें और संभावित रोग तथा उसका विश्वास स्तर देखें।",
    uploadTitle: "पौधे की छवि अपलोड करें",
    uploadDescription: "समर्थित प्रारूप: JPG, JPEG, PNG. अधिकतम फ़ाइल आकार: 10 MB.",
    chooseImage: "छवि चुनें",
    selectedFile: "चयनित फ़ाइल",
    previewTitle: "छवि पूर्वावलोकन",
    readyTitle: "विश्लेषण के लिए तैयार",
    readyDescription: "हम छवि को बैकएंड पर भेजेंगे और रोग का नाम व विश्वास स्तर दिखाएंगे।",
    detectDisease: "रोग पहचानें",
    detecting: "रोग की पहचान हो रही है...",
    uploadAnother: "दूसरी छवि अपलोड करें",
    resultTitle: "परिणाम",
    diseaseLabel: "रोग",
    confidenceLabel: "विश्वास",
    treatmentTitle: "उपचार",
    pesticideLabel: "कीटनाशक",
    dosageLabel: "मात्रा",
    frequencyLabel: "आवृत्ति",
    preventionTitle: "बचाव",
    noPrevention: "कोई बचाव सुझाव उपलब्ध नहीं है।",
    debugTitle: "डिबग पेलोड",
    debugDescription: "रिस्पॉन्स में उपचार विवरण नहीं मिला। यह बैकएंड से मिला कच्चा पेलोड है।",
    emptyState: "रोग पहचान शुरू करने के लिए छवि अपलोड करें।",
    noFileError: "सबमिट करने से पहले कृपया एक छवि चुनें।",
    invalidTypeError: "कृपया JPG, JPEG, या PNG छवि अपलोड करें।",
    failedDetection: "रोग पहचान विफल रही। कृपया फिर से प्रयास करें।",
  },
  gujarati: {
    backToDashboard: "ડેશબોર્ડ પર પાછા જાઓ",
    eyebrow: "AI છોડ આરોગ્ય સ્કેન",
    title: "રોગ શોધ",
    subtitle: "પાનની સ્પષ્ટ છબી અપલોડ કરો અને સંભવિત રોગ સાથે વિશ્વાસ સ્તર મેળવો.",
    uploadTitle: "છોડની છબી અપલોડ કરો",
    uploadDescription: "સમર્થિત ફોર્મેટ: JPG, JPEG, PNG. મહત્તમ ફાઇલ કદ: 10 MB.",
    chooseImage: "છબી પસંદ કરો",
    selectedFile: "પસંદ કરેલ ફાઇલ",
    previewTitle: "છબી પૂર્વાવલોકન",
    readyTitle: "વિશ્લેષણ માટે તૈયાર",
    readyDescription: "અમે છબી બેકએન્ડ પર મોકલીને રોગનું નામ અને વિશ્વાસ સ્તર બતાવીશું.",
    detectDisease: "રોગ શોધો",
    detecting: "રોગ શોધાઈ રહ્યો છે...",
    uploadAnother: "બીજી છબી અપલોડ કરો",
    resultTitle: "શોધ પરિણામ",
    diseaseLabel: "રોગ",
    confidenceLabel: "વિશ્વાસ",
    treatmentTitle: "ઉપચાર",
    pesticideLabel: "દવા",
    dosageLabel: "માત્રા",
    frequencyLabel: "આવર્તન",
    preventionTitle: "પ્રતિરોધ",
    noPrevention: "પ્રતિરોધ સૂચનો ઉપલબ્ધ નથી.",
    debugTitle: "ડિબગ પેલોડ",
    debugDescription: "રિસ્પોન્સમાં ઉપચારની વિગતો મળેલી નથી. બેકએન્ડથી મળેલો કાચો પેલોડ અહીં છે.",
    emptyState: "રોગ શોધવા માટે છબી અપલોડ કરો.",
    noFileError: "સબમિટ કરતા પહેલાં કૃપા કરીને છબી પસંદ કરો.",
    invalidTypeError: "કૃપા કરીને JPG, JPEG, અથવા PNG છબી અપલોડ કરો.",
    failedDetection: "રોગ શોધ નિષ્ફળ ગઈ. કૃપા કરીને ફરી પ્રયાસ કરો.",
  },
};

function formatConfidence(value) {
  return `${(Number(value || 0) * 100).toFixed(1)}%`;
}

export function DiseaseDetection() {
  const { language } = useLanguage();
  const copy = getLocalizedCopy(language, DISEASE_COPY);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [result, setResult] = useState(null);
  const [rawPrediction, setRawPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const translateValue = (value, fallback = "N/A") => {
    const resolvedValue = value || fallback;
    return translateDynamicValue(resolvedValue, language);
  };

  useEffect(() => {
    if (!image) {
      setPreviewUrl("");
      return undefined;
    }

    const nextPreviewUrl = URL.createObjectURL(image);
    setPreviewUrl(nextPreviewUrl);

    return () => {
      URL.revokeObjectURL(nextPreviewUrl);
    };
  }, [image]);

  const handleFileChange = (event) => {
    const nextFile = event.target.files?.[0] || null;

    if (!nextFile) {
      return;
    }

    if (!nextFile.type.startsWith("image/")) {
      setError(copy.invalidTypeError);
      setImage(null);
      setResult(null);
      setRawPrediction(null);
      return;
    }

    setImage(nextFile);
    setResult(null);
    setRawPrediction(null);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!image) {
      setError(copy.noFileError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await detectDisease(image);
      const prediction = response?.data;
      const treatment = prediction?.treatment || {
        pesticide: prediction?.pesticide,
        dosage: prediction?.dosage,
        frequency: prediction?.frequency,
      };

      if (!response?.success || !prediction?.disease) {
        throw new Error(response?.error || copy.failedDetection);
      }

      setRawPrediction(prediction || null);
      setResult({
        disease: prediction.disease,
        confidence: Number(prediction.confidence || 0),
        treatment,
        prevention: Array.isArray(prediction.prevention) ? prediction.prevention : [],
      });
    } catch (submitError) {
      setResult(null);
      setRawPrediction(submitError?.response?.data || null);
      setError(submitError?.response?.data?.error || submitError.message || copy.failedDetection);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setImage(null);
    setResult(null);
    setRawPrediction(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.16),_transparent_30%),linear-gradient(135deg,_#08120f,_#0d1b16_45%,_#12231d)] text-white">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          to="/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm text-emerald-300 transition hover:text-emerald-200"
        >
          <ArrowLeft className="h-4 w-4" />
          {copy.backToDashboard}
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-3xl border border-emerald-400/20 bg-black/20 p-8 shadow-2xl backdrop-blur"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-sm text-emerald-200">
            <Camera className="h-4 w-4" />
            {copy.eyebrow}
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{copy.title}</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">{copy.subtitle}</p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="h-full border-emerald-400/20 bg-slate-950/70 shadow-xl">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-white">{copy.uploadTitle}</h2>
                    <p className="mt-2 text-sm text-slate-400">{copy.uploadDescription}</p>
                  </div>

                  <label className="block cursor-pointer rounded-2xl border-2 border-dashed border-emerald-400/30 bg-emerald-400/5 p-8 text-center transition hover:border-emerald-300/60 hover:bg-emerald-400/10">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-400/10">
                      <Upload className="h-8 w-8 text-emerald-300" />
                    </div>
                    <div className="text-lg font-medium text-white">{copy.chooseImage}</div>
                    <div className="mt-2 text-sm text-slate-400">
                      {image ? `${copy.selectedFile}: ${image.name}` : copy.emptyState}
                    </div>
                  </label>

                  {error ? (
                    <div className="flex items-start gap-3 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                      <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  ) : null}

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                      type="submit"
                      disabled={loading || !image}
                      className="flex-1 rounded-xl bg-emerald-500 py-6 text-base font-semibold text-slate-950 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-500/50"
                    >
                      {loading ? (
                        <span className="inline-flex items-center gap-2">
                          <LoaderCircle className="h-5 w-5 animate-spin" />
                          {copy.detecting}
                        </span>
                      ) : (
                        copy.detectDisease
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                      className="rounded-xl border-emerald-400/30 bg-transparent py-6 text-emerald-200 hover:bg-emerald-400/10"
                    >
                      {copy.uploadAnother}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <Card className="border-emerald-400/20 bg-slate-950/70 shadow-xl">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                  <ImagePlus className="h-5 w-5 text-emerald-300" />
                  {copy.previewTitle}
                </div>
                <div className="overflow-hidden rounded-2xl border border-emerald-400/20 bg-slate-900">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Selected plant" className="h-72 w-full object-cover" />
                  ) : (
                    <div className="flex h-72 items-center justify-center px-6 text-center text-sm text-slate-500">
                      {copy.emptyState}
                    </div>
                  )}
                </div>
                <div className="mt-4 text-sm text-slate-400">
                  <div className="font-medium text-white">{copy.readyTitle}</div>
                  <p className="mt-1">{copy.readyDescription}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-400/20 bg-slate-950/70 shadow-xl">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-white">{copy.resultTitle}</h2>
                {result ? (
                  <div className="mt-5 space-y-4">
                    <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                      <div className="text-sm text-emerald-200">{copy.diseaseLabel}</div>
                      <div className="mt-1 text-2xl font-semibold text-white">
                        {translateValue(result.disease, result.disease)}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
                      <div className="text-sm text-cyan-200">{copy.confidenceLabel}</div>
                      <div className="mt-1 text-2xl font-semibold text-white">
                        {formatConfidence(result.confidence)}
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-white/10">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                          style={{ width: `${Math.max(4, Math.min(result.confidence * 100, 100))}%` }}
                        />
                      </div>
                    </div>
                    <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
                      <div className="mb-3 text-sm font-medium text-amber-200">{copy.treatmentTitle}</div>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="rounded-xl border border-amber-300/10 bg-black/10 p-3">
                          <div className="text-xs uppercase tracking-wide text-amber-200/80">
                            {copy.pesticideLabel}
                          </div>
                          <div className="mt-1 text-sm font-medium text-white">
                            {translateValue(result.treatment?.pesticide)}
                          </div>
                        </div>
                        <div className="rounded-xl border border-amber-300/10 bg-black/10 p-3">
                          <div className="text-xs uppercase tracking-wide text-amber-200/80">
                            {copy.dosageLabel}
                          </div>
                          <div className="mt-1 text-sm font-medium text-white">
                            {translateValue(result.treatment?.dosage)}
                          </div>
                        </div>
                        <div className="rounded-xl border border-amber-300/10 bg-black/10 p-3">
                          <div className="text-xs uppercase tracking-wide text-amber-200/80">
                            {copy.frequencyLabel}
                          </div>
                          <div className="mt-1 text-sm font-medium text-white">
                            {translateValue(result.treatment?.frequency)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-fuchsia-400/20 bg-fuchsia-400/10 p-4">
                      <div className="mb-3 text-sm font-medium text-fuchsia-200">
                        {copy.preventionTitle}
                      </div>
                      {result.prevention.length ? (
                        <ul className="space-y-2">
                          {result.prevention.map((tip) => (
                            <li
                              key={tip}
                              className="flex items-start gap-3 rounded-xl border border-fuchsia-300/10 bg-black/10 p-3 text-sm text-slate-100"
                            >
                              <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-fuchsia-300" />
                              <span>{translateValue(tip, tip)}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="rounded-xl border border-fuchsia-300/10 bg-black/10 p-3 text-sm text-slate-200">
                          {copy.noPrevention}
                        </div>
                      )}
                    </div>
                    {rawPrediction &&
                    (!result.treatment?.dosage || !result.treatment?.frequency) ? (
                      <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4">
                        <div className="text-sm font-medium text-red-200">{copy.debugTitle}</div>
                        <p className="mt-2 text-xs text-red-100/80">{copy.debugDescription}</p>
                        <pre className="mt-3 overflow-x-auto rounded-xl bg-black/20 p-3 text-xs text-red-50">
                          {JSON.stringify(rawPrediction, null, 2)}
                        </pre>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="mt-5 rounded-2xl border border-dashed border-slate-700 p-6 text-sm text-slate-400">
                    {copy.emptyState}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
