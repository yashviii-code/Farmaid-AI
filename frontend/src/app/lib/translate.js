import en from "../../i18n/en.json";
import gu from "../../i18n/gu.json";

const dictionaries = {
  en,
  gu,
};

const languageMap = {
  en: "en",
  english: "en",
  gu: "gu",
  gujarati: "gu",
};

function normalizeKey(key) {
  return String(key || "")
    .trim()
    .toLowerCase()
    .replace(/[()]/g, "")
    .replace(/%/g, "percent")
    .replace(/\+/g, "plus")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function resolveLanguage(language) {
  if (language && languageMap[language]) {
    return languageMap[language];
  }

  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("farmaidLanguage") || localStorage.getItem("lang") || "english";
    return languageMap[stored] || "en";
  }

  return "en";
}

export function translate(key, language, params = {}) {
  const resolvedLanguage = resolveLanguage(language);
  const normalizedKey = normalizeKey(key);
  const template = dictionaries[resolvedLanguage]?.[normalizedKey] || dictionaries.en?.[normalizedKey] || key;

  return String(template).replace(/\{(\w+)\}/g, (_, token) => {
    return params[token] ?? `{${token}}`;
  });
}
