import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { FileText, Leaf, RefreshCw, Sprout, Upload } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { translate } from "../lib/translate";
import { getCropRecommendations, getCropRecommendationsFromOcr } from "../api/crop.api";
import { getCurrentLocationWeather } from "../api/location.api";

const LOCATION_OPTIONS = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const SEASON_OPTIONS = ["Kharif", "Rabi", "Zaid"];
const SOIL_OPTIONS = ["Loamy", "Clay", "Sandy"];

const FIELD_RULES = {
  N: { labelKey: "nitrogen_n", min: 0, max: 140, step: "1", unit: "" },
  P: { labelKey: "phosphorus_p", min: 5, max: 145, step: "1", unit: "" },
  K: { labelKey: "potassium_k", min: 5, max: 205, step: "1", unit: "" },
  temperature: { labelKey: "temperature_c", min: 0, max: 50, step: "1", unit: " C" },
  humidity: { labelKey: "humidity_percent", min: 0, max: 100, step: "1", unit: "" },
  ph: { labelKey: "soil_ph", min: 0, max: 14, step: "0.1", unit: "" },
  rainfall: { labelKey: "rainfall_mm", min: 0, max: 500, step: "1", unit: "" },
};

const NUMERIC_FIELDS = Object.keys(FIELD_RULES);

const INITIAL_FORM_DATA = {
  N: "",
  P: "",
  K: "",
  temperature: "",
  humidity: "",
  ph: "",
  rainfall: "",
  location: "",
  season: "",
  soil: "",
};

const INITIAL_OCR_FORM_DATA = {
  ...INITIAL_FORM_DATA,
  location: "Gujarat",
  season: "Kharif",
  soil: "Loamy",
};

function FieldCard({ label, children }) {
  return (
    <div className="bg-[#111c2a] border border-[#1e293b] rounded-2xl p-5">
      <label className="block text-slate-300 font-semibold mb-3 text-sm">{label}</label>
      {children}
    </div>
  );
}

function ResultsPanel({ recommendations, explanation, t }) {
  if (!recommendations.length) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#111c2a] border border-[#1e293b] rounded-2xl p-6"
    >
      <h3 className="text-lg font-bold text-white mb-4">{t("top_3_crops")}</h3>
      {explanation ? (
        <div className="bg-[#0b131e] border border-[#1e293b] p-4 rounded-xl text-slate-300 text-sm mb-6">
          <strong>{t("analysis")}: </strong>
          {explanation}
        </div>
      ) : null}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {recommendations.slice(0, 3).map((crop) => (
          <div
            key={crop.crop}
            className="bg-[#0b131e] border border-[#1e293b] rounded-xl p-4 flex flex-col items-center text-center"
          >
            <div className="w-14 h-14 bg-[#111c2a] rounded-full flex items-center justify-center mb-3">
              <Sprout className="w-7 h-7 text-[#00d084]" />
            </div>
            <h4 className="text-white font-bold uppercase mb-2">{t(crop.crop)}</h4>
            <div className="text-[#00d084] font-bold text-sm bg-[#00d084]/10 px-3 py-1 rounded-full">
              {t("confidence")}: {Math.round((crop.confidence || 0) * 100)}%
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function parseFieldErrors(errorDetails = {}) {
  return Object.entries(errorDetails).reduce((accumulator, [key, value]) => {
    accumulator[key] = String(value);
    return accumulator;
  }, {});
}

export function CropRecommendation() {
  const { language } = useLanguage();
  const t = (key, params) => translate(key, language, params);

  const [activeTab, setActiveTab] = useState("form");
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [recommendations, setRecommendations] = useState([]);
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState("");
  const [locationStatus, setLocationStatus] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const [ocrImage, setOcrImage] = useState(null);
  const [ocrPreviewUrl, setOcrPreviewUrl] = useState("");
  const [ocrFormData, setOcrFormData] = useState(INITIAL_OCR_FORM_DATA);
  const [ocrRecommendations, setOcrRecommendations] = useState([]);
  const [ocrFieldErrors, setOcrFieldErrors] = useState({});
  const [ocrMissingFields, setOcrMissingFields] = useState([]);
  const [ocrError, setOcrError] = useState("");
  const [ocrStatus, setOcrStatus] = useState("");
  const [ocrRawText, setOcrRawText] = useState("");
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrSubmitting, setOcrSubmitting] = useState(false);

  useEffect(() => {
    if (!ocrImage) {
      setOcrPreviewUrl("");
      return undefined;
    }

    const preview = URL.createObjectURL(ocrImage);
    setOcrPreviewUrl(preview);

    return () => {
      URL.revokeObjectURL(preview);
    };
  }, [ocrImage]);

  const validateField = (name, value) => {
    if (name in FIELD_RULES) {
      const rule = FIELD_RULES[name];
      const label = t(rule.labelKey);

      if (String(value).trim() === "") {
        return t("is_required", { label });
      }

      const numericValue = Number(value);
      if (!Number.isFinite(numericValue)) {
        return t("must_be_a_number", { label });
      }

      if (numericValue < rule.min || numericValue > rule.max) {
        return t("must_be_between", {
          label,
          min: rule.min,
          max: rule.max,
          unit: rule.unit,
        });
      }

      return "";
    }

    if (name === "location" && !String(value).trim()) {
      return t("is_required", { label: t("location") });
    }

    if (name === "season" && !String(value).trim()) {
      return t("is_required", { label: t("season") });
    }

    if (name === "soil" && !String(value).trim()) {
      return t("is_required", { label: t("soil_type") });
    }

    return "";
  };

  const validateForm = (values) => {
    const nextErrors = {};

    for (const field of [...NUMERIC_FIELDS, "location", "season", "soil"]) {
      const message = validateField(field, values[field]);
      if (message) {
        nextErrors[field] = message;
      }
    }

    return nextErrors;
  };

  const normalizePredictionPayload = (values) => ({
    ...values,
    N: Number(values.N),
    P: Number(values.P),
    K: Number(values.K),
    temperature: Number(values.temperature),
    humidity: Number(values.humidity),
    ph: Number(values.ph),
    rainfall: Number(values.rainfall),
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    setFieldErrors((previous) => ({
      ...previous,
      [name]: validateField(name, value),
    }));

    if (error) {
      setError("");
    }
  };

  const handleOcrFieldChange = (event) => {
    const { name, value } = event.target;
    setOcrFormData((previous) => ({ ...previous, [name]: value }));
    setOcrFieldErrors((previous) => ({
      ...previous,
      [name]: validateField(name, value),
    }));
    if (ocrError) {
      setOcrError("");
    }
  };

  const submitRecommendations = async ({
    values,
    setLoadingState,
    setErrorState,
    setFieldErrorsState,
    setRecommendationsState,
    setExplanationState,
  }) => {
    const validationErrors = validateForm(values);
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrorsState(validationErrors);
      setErrorState(t("please_fill_in_every_field_before_submitting"));
      setRecommendationsState([]);
      setExplanationState("");
      return false;
    }

    setLoadingState(true);
    setErrorState("");
    setFieldErrorsState({});

    try {
      const response = await getCropRecommendations(normalizePredictionPayload(values));
      const result = response?.data || {};
      setRecommendationsState(result.recommendations || []);
      setExplanationState(result.explanation || "");
      return true;
    } catch (requestError) {
      setRecommendationsState([]);
      setExplanationState("");
      if (requestError.response?.data?.details) {
        setFieldErrorsState(parseFieldErrors(requestError.response.data.details));
      }
      setErrorState(
        requestError.response?.data?.error ||
          requestError.response?.data?.message ||
          t("unable_to_reach_the_backend_service"),
      );
      return false;
    } finally {
      setLoadingState(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await submitRecommendations({
      values: formData,
      setLoadingState: setLoading,
      setErrorState: setError,
      setFieldErrorsState: setFieldErrors,
      setRecommendationsState: setRecommendations,
      setExplanationState: setExplanation,
    });
  };

  const applyAutoFilledLocationData = (locationData) => {
    setFormData((previous) => {
      const next = {
        ...previous,
        location: locationData.location || previous.location,
        season: locationData.season || previous.season,
        temperature:
          locationData.temperature !== undefined ? String(locationData.temperature) : previous.temperature,
        humidity: locationData.humidity !== undefined ? String(locationData.humidity) : previous.humidity,
        rainfall: locationData.rainfall !== undefined ? String(locationData.rainfall) : previous.rainfall,
      };

      setFieldErrors((current) => ({
        ...current,
        location: validateField("location", next.location),
        season: validateField("season", next.season),
        temperature: validateField("temperature", next.temperature),
        humidity: validateField("humidity", next.humidity),
        rainfall: validateField("rainfall", next.rainfall),
      }));

      return next;
    });
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError(t("geolocation_not_supported"));
      return;
    }

    setLocationLoading(true);
    setLocationStatus("");
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const response = await getCurrentLocationWeather({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });

          const locationData = response?.data || {};
          applyAutoFilledLocationData(locationData);
          setLocationStatus(t("current_location_weather_filled"));
        } catch (requestError) {
          setLocationStatus("");
          setError(
            requestError.response?.data?.error ||
              requestError.response?.data?.message ||
              t("failed_current_location"),
          );
        } finally {
          setLocationLoading(false);
        }
      },
      (geoError) => {
        setLocationLoading(false);
        setLocationStatus("");
        if (geoError?.code === 1) {
          setError(t("location_permission_denied"));
          return;
        }

        setError(t("failed_current_location"));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  };

  const handleOcrImageChange = (event) => {
    const file = event.target.files?.[0] || null;
    setOcrImage(file);
    setOcrRecommendations([]);
    setOcrMissingFields([]);
    setOcrRawText("");
    setOcrStatus("");
    setOcrError("");
    setOcrFieldErrors({});
  };

  const handleOcrScan = async () => {
    if (!ocrImage) {
      setOcrError(t("please_choose_a_report_image"));
      return;
    }

    setOcrLoading(true);
    setOcrError("");
    setOcrStatus("");

    try {
      const response = await getCropRecommendationsFromOcr({
        image: ocrImage,
        location: ocrFormData.location,
        season: ocrFormData.season,
        soil: ocrFormData.soil,
      });

      const result = response?.data || {};
      const extracted = result.extracted || {};
      const context = result.context || {};

      setOcrFormData((previous) => ({
        ...previous,
        ...Object.fromEntries(
          NUMERIC_FIELDS.map((field) => [
            field,
            extracted[field] !== undefined ? String(extracted[field]) : previous[field],
          ]),
        ),
        location: context.location || previous.location,
        season: context.season || previous.season,
        soil: context.soil || previous.soil,
      }));
      setOcrRecommendations(result.recommendations || []);
      setOcrMissingFields(result.missing_fields || []);
      setOcrRawText(result.raw_text || "");
      setOcrFieldErrors(parseFieldErrors(result.prediction_errors || {}));
      setOcrStatus(
        (result.missing_fields || []).length
          ? t("ocr_missing_values_detected")
          : t("ocr_values_extracted_successfully"),
      );
    } catch (requestError) {
      setOcrRecommendations([]);
      setOcrMissingFields([]);
      setOcrRawText("");
      setOcrError(
        requestError.response?.data?.error ||
          requestError.response?.data?.message ||
          t("ocr_failed_to_process_report"),
      );
    } finally {
      setOcrLoading(false);
    }
  };

  const handleOcrRecommendationRefresh = async () => {
    await submitRecommendations({
      values: ocrFormData,
      setLoadingState: setOcrSubmitting,
      setErrorState: setOcrError,
      setFieldErrorsState: setOcrFieldErrors,
      setRecommendationsState: setOcrRecommendations,
      setExplanationState: () => {},
    });
  };

  const renderNumericFields = (values, onChange, errorsByField) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {NUMERIC_FIELDS.map((field) => (
        <FieldCard key={field} label={t(FIELD_RULES[field].labelKey)}>
          <>
            <input
              type="number"
              step={FIELD_RULES[field].step}
              min={String(FIELD_RULES[field].min)}
              max={String(FIELD_RULES[field].max)}
              name={field}
              value={values[field]}
              onChange={onChange}
              className={`w-full bg-[#0b131e] border rounded-xl px-4 py-3.5 text-white focus:ring-1 outline-none transition-all ${
                errorsByField[field]
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-[#1e293b] focus:border-[#00d084] focus:ring-[#00d084]"
              }`}
            />
            {errorsByField[field] ? (
              <p className="mt-2 text-sm text-red-400">{errorsByField[field]}</p>
            ) : null}
          </>
        </FieldCard>
      ))}
    </div>
  );

  const renderContextFields = (values, onChange, errorsByField) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <FieldCard label={t("location")}>
        <>
          <select
            name="location"
            value={values.location}
            onChange={onChange}
            className={`w-full bg-[#0b131e] border rounded-xl px-4 py-3.5 text-white focus:ring-1 outline-none transition-all ${
              errorsByField.location
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-[#1e293b] focus:border-[#00d084] focus:ring-[#00d084]"
            }`}
          >
            <option value="">{t("select_location")}</option>
            {LOCATION_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {t(option)}
              </option>
            ))}
          </select>
          {errorsByField.location ? (
            <p className="mt-2 text-sm text-red-400">{errorsByField.location}</p>
          ) : null}
        </>
      </FieldCard>

      <FieldCard label={t("season")}>
        <>
          <select
            name="season"
            value={values.season}
            onChange={onChange}
            className={`w-full bg-[#0b131e] border rounded-xl px-4 py-3.5 text-white focus:ring-1 outline-none transition-all ${
              errorsByField.season
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-[#1e293b] focus:border-[#00d084] focus:ring-[#00d084]"
            }`}
          >
            <option value="">{t("select_season")}</option>
            {SEASON_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {t(option)}
              </option>
            ))}
          </select>
          {errorsByField.season ? (
            <p className="mt-2 text-sm text-red-400">{errorsByField.season}</p>
          ) : null}
        </>
      </FieldCard>

      <FieldCard label={t("soil_type")}>
        <>
          <select
            name="soil"
            value={values.soil}
            onChange={onChange}
            className={`w-full bg-[#0b131e] border rounded-xl px-4 py-3.5 text-white focus:ring-1 outline-none transition-all ${
              errorsByField.soil
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-[#1e293b] focus:border-[#00d084] focus:ring-[#00d084]"
            }`}
          >
            <option value="">{t("select_soil_type")}</option>
            {SOIL_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {t(option)}
              </option>
            ))}
          </select>
          {errorsByField.soil ? (
            <p className="mt-2 text-sm text-red-400">{errorsByField.soil}</p>
          ) : null}
        </>
      </FieldCard>
    </div>
  );

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-12 font-sans">
      <div className="flex items-center gap-5 mb-12">
        <div className="w-16 h-16 bg-[#00d084] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-[0_0_30px_rgba(0,208,132,0.3)]">
          <Leaf className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#00d084] mb-1 tracking-tight">
            {t("crop_recommendation_title")}
          </h1>
          <p className="text-slate-400 text-sm md:text-base font-medium">
            {t("crop_recommendation_subtitle")}
          </p>
        </div>
      </div>

      <div className="flex bg-[#0b131e] rounded-[2.5rem] p-2 mx-auto w-full max-w-3xl border border-[#1e293b]">
        <button
          onClick={() => setActiveTab("form")}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-full font-bold transition-all text-[15px] ${
            activeTab === "form"
              ? "bg-[#00d084] text-[#0b131e] shadow-lg shadow-[#00d084]/20"
              : "text-slate-400 hover:text-white hover:bg-[#1e293b]/50"
          }`}
        >
          {t("manual_entry")}
        </button>
        <button
          onClick={() => setActiveTab("ocr")}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-full font-bold transition-all text-[15px] ${
            activeTab === "ocr"
              ? "bg-[#0ea5e9] text-white shadow-lg shadow-[#0ea5e9]/20"
              : "text-slate-400 hover:text-white hover:bg-[#1e293b]/50"
          }`}
        >
          <FileText size={18} />
          {t("scan_lab_report_ocr")}
        </button>
      </div>

      <div className="bg-[#0b131e] rounded-[2rem] p-6 md:p-10 border border-[#1e293b]">
        {activeTab === "form" ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            {renderNumericFields(formData, handleChange, fieldErrors)}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FieldCard label={t("location")}>
                <>
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    disabled={locationLoading}
                    className="mb-3 inline-flex w-full items-center justify-center rounded-xl border border-[#00d084]/30 bg-[#00d084]/10 px-4 py-3 text-sm font-semibold text-[#00d084] transition-colors hover:bg-[#00d084]/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {locationLoading ? t("detecting_location") : t("use_current_location")}
                  </button>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={`w-full bg-[#0b131e] border rounded-xl px-4 py-3.5 text-white focus:ring-1 outline-none transition-all ${
                      fieldErrors.location
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-[#1e293b] focus:border-[#00d084] focus:ring-[#00d084]"
                    }`}
                  >
                    <option value="">{t("select_location")}</option>
                    {LOCATION_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {t(option)}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.location ? (
                    <p className="mt-2 text-sm text-red-400">{fieldErrors.location}</p>
                  ) : null}
                </>
              </FieldCard>

              <FieldCard label={t("season")}>
                <>
                  <select
                    name="season"
                    value={formData.season}
                    onChange={handleChange}
                    className={`w-full bg-[#0b131e] border rounded-xl px-4 py-3.5 text-white focus:ring-1 outline-none transition-all ${
                      fieldErrors.season
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-[#1e293b] focus:border-[#00d084] focus:ring-[#00d084]"
                    }`}
                  >
                    <option value="">{t("select_season")}</option>
                    {SEASON_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {t(option)}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.season ? (
                    <p className="mt-2 text-sm text-red-400">{fieldErrors.season}</p>
                  ) : null}
                </>
              </FieldCard>

              <FieldCard label={t("soil_type")}>
                <>
                  <select
                    name="soil"
                    value={formData.soil}
                    onChange={handleChange}
                    className={`w-full bg-[#0b131e] border rounded-xl px-4 py-3.5 text-white focus:ring-1 outline-none transition-all ${
                      fieldErrors.soil
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-[#1e293b] focus:border-[#00d084] focus:ring-[#00d084]"
                    }`}
                  >
                    <option value="">{t("select_soil_type")}</option>
                    {SOIL_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {t(option)}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.soil ? (
                    <p className="mt-2 text-sm text-red-400">{fieldErrors.soil}</p>
                  ) : null}
                </>
              </FieldCard>
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            ) : null}

            {locationStatus ? (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                {locationStatus}
              </div>
            ) : null}

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full bg-[#00d084] hover:bg-[#00e090] text-[#0b131e] font-bold text-[17px] py-5 rounded-[1rem] flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? t("analyzing") : t("get_crop_recommendation")}
            </motion.button>

            <ResultsPanel recommendations={recommendations} explanation={explanation} t={t} />
          </form>
        ) : (
          <div className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="space-y-6">
                <div className="border-2 border-dashed border-[#1e293b] bg-[#0b131e] rounded-[2rem] p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-b from-[#0ea5e9] to-[#0284c7] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[#0ea5e9]/20">
                    <Upload className="text-white w-8 h-8" strokeWidth={2.5} />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-3">{t("ocr_upload_title")}</h2>
                  <p className="text-slate-400 mb-6 text-sm leading-relaxed">
                    {t("ocr_upload_description")}
                  </p>
                  <label className="block cursor-pointer rounded-2xl border border-[#1e293b] bg-[#111c2a] px-5 py-6 hover:border-[#0ea5e9] transition-colors">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={handleOcrImageChange}
                      className="sr-only"
                    />
                    <div className="font-semibold text-white">{t("choose_report_image")}</div>
                    <div className="mt-2 text-sm text-slate-400">
                      {ocrImage ? ocrImage.name : t("no_report_image_selected")}
                    </div>
                  </label>
                  <button
                    type="button"
                    onClick={handleOcrScan}
                    disabled={ocrLoading || !ocrImage}
                    className="mt-6 w-full rounded-[1rem] bg-[#0ea5e9] hover:bg-[#38bdf8] text-white font-bold text-[16px] py-4 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {ocrLoading ? t("extracting_report") : t("extract_report_and_predict")}
                  </button>
                </div>

                <div className="bg-[#111c2a] border border-[#1e293b] rounded-2xl p-5">
                  <h3 className="text-lg font-bold text-white mb-4">{t("report_preview")}</h3>
                  <div className="overflow-hidden rounded-2xl border border-[#1e293b] bg-[#0b131e] min-h-[250px] flex items-center justify-center">
                    {ocrPreviewUrl ? (
                      <img src={ocrPreviewUrl} alt="OCR report preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-slate-500 text-sm px-6 text-center">{t("ocr_preview_placeholder")}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-[#111c2a] border border-[#1e293b] rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-2">{t("extracted_values_title")}</h3>
                  <p className="text-sm text-slate-400 mb-6">{t("review_correct_values")}</p>

                  {renderNumericFields(ocrFormData, handleOcrFieldChange, ocrFieldErrors)}

                  <div className="mt-6">{renderContextFields(ocrFormData, handleOcrFieldChange, ocrFieldErrors)}</div>

                  {ocrError ? (
                    <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                      {ocrError}
                    </div>
                  ) : null}

                  {ocrStatus ? (
                    <div className="mt-6 rounded-2xl border border-sky-500/30 bg-sky-500/10 px-4 py-3 text-sm text-sky-200">
                      {ocrStatus}
                    </div>
                  ) : null}

                  {ocrMissingFields.length ? (
                    <div className="mt-6 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-200">
                      <strong>{t("ocr_missing_values_detected")}: </strong>
                      {ocrMissingFields.join(", ")}. {t("ocr_missing_values_help")}
                    </div>
                  ) : null}

                  <button
                    type="button"
                    onClick={handleOcrRecommendationRefresh}
                    disabled={ocrSubmitting}
                    className="mt-6 w-full rounded-[1rem] bg-[#00d084] hover:bg-[#00e090] text-[#0b131e] font-bold text-[17px] py-4 flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <RefreshCw className={`w-5 h-5 ${ocrSubmitting ? "animate-spin" : ""}`} />
                    {ocrSubmitting ? t("analyzing") : t("refresh_recommendations")}
                  </button>
                </div>

                {ocrRawText ? (
                  <div className="bg-[#111c2a] border border-[#1e293b] rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">{t("ocr_raw_text_title")}</h3>
                    <pre className="whitespace-pre-wrap rounded-xl bg-[#0b131e] border border-[#1e293b] p-4 text-sm text-slate-300 max-h-56 overflow-auto">
                      {ocrRawText}
                    </pre>
                  </div>
                ) : null}
              </div>
            </div>

            <ResultsPanel
              recommendations={ocrRecommendations}
              explanation={ocrRecommendations.length ? t("ocr_recommendations_note") : ""}
              t={t}
            />
          </div>
        )}
      </div>
    </div>
  );
}
