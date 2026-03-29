import { useState } from "react";
import { motion } from "motion/react";
import { FileText, Leaf, Sprout } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { translate } from "../lib/translate";
import { getCropRecommendations } from "../api/crop.api";

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

function FieldCard({ label, children }) {
  return (
    <div className="bg-[#111c2a] border border-[#1e293b] rounded-2xl p-5">
      <label className="block text-slate-300 font-semibold mb-3 text-sm">{label}</label>
      {children}
    </div>
  );
}

export function CropRecommendation() {
  const { language } = useLanguage();
  const t = (key, params) => translate(key, language, params);
  const [activeTab, setActiveTab] = useState("form");
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [recommendations, setRecommendations] = useState([]);
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFieldErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setError(t("please_fill_in_every_field_before_submitting"));
      setRecommendations([]);
      setExplanation("");
      return;
    }

    setLoading(true);
    setError("");
    setFieldErrors({});

    try {
      const payload = {
        ...formData,
        N: Number(formData.N),
        P: Number(formData.P),
        K: Number(formData.K),
        temperature: Number(formData.temperature),
        humidity: Number(formData.humidity),
        ph: Number(formData.ph),
        rainfall: Number(formData.rainfall),
      };

      const response = await getCropRecommendations(payload);
      const result = response?.data || {};

      setRecommendations(result.recommendations || []);
      setExplanation(result.explanation || "");
    } catch (requestError) {
      setRecommendations([]);
      setExplanation("");
      if (requestError.response?.data?.details) {
        setFieldErrors(requestError.response.data.details);
      }
      setError(
        requestError.response?.data?.error ||
          requestError.response?.data?.message ||
          t("unable_to_reach_the_backend_service"),
      );
    } finally {
      setLoading(false);
    }
  };

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
                      value={formData[field]}
                      onChange={handleChange}
                      className={`w-full bg-[#0b131e] border rounded-xl px-4 py-3.5 text-white focus:ring-1 outline-none transition-all ${
                        fieldErrors[field]
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-[#1e293b] focus:border-[#00d084] focus:ring-[#00d084]"
                      }`}
                    />
                    {fieldErrors[field] ? (
                      <p className="mt-2 text-sm text-red-400">{fieldErrors[field]}</p>
                    ) : null}
                  </>
                </FieldCard>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FieldCard label={t("location")}>
                <>
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

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full bg-[#00d084] hover:bg-[#00e090] text-[#0b131e] font-bold text-[17px] py-5 rounded-[1rem] flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? t("analyzing") : t("get_crop_recommendation")}
            </motion.button>

            {recommendations.length > 0 ? (
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
                    <div key={crop.crop} className="bg-[#0b131e] border border-[#1e293b] rounded-xl p-4 flex flex-col items-center text-center">
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
            ) : null}
          </form>
        ) : (
          <div className="py-8 md:py-16">
            <div className="w-full max-w-3xl mx-auto border-2 border-dashed border-[#1e293b] bg-[#0b131e] rounded-[2rem] p-10 md:p-16 text-center">
              <div className="w-24 h-24 bg-gradient-to-b from-[#0ea5e9] to-[#0284c7] rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-[#0ea5e9]/20">
                <FileText className="text-white w-10 h-10" strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{t("ocr_coming_soon")}</h2>
              <p className="text-slate-400 mb-10 max-w-md mx-auto text-sm md:text-base leading-relaxed">
                {t("ocr_placeholder_text")}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
