const isPlainObject = (value) => value && typeof value === 'object' && !Array.isArray(value);

const mergeCopy = (base, overrides) => {
  if (!isPlainObject(base) || !isPlainObject(overrides)) {
    return overrides ?? base;
  }

  const merged = { ...base };

  Object.entries(overrides).forEach(([key, value]) => {
    if (isPlainObject(value) && isPlainObject(base[key])) {
      merged[key] = mergeCopy(base[key], value);
      return;
    }

    merged[key] = value;
  });

  return merged;
};

export function getLocalizedCopy(language, copy) {
  return mergeCopy(copy.english || {}, copy[language] || {});
}
