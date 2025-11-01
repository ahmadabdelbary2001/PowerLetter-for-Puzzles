// src/lib/i18nUtils.ts
export const normalizeToStringArray = (value: unknown): readonly string[] => {
  if (Array.isArray(value)) {
    return value.map(v => String(v)) as readonly string[];
  }

  if (value && typeof value === 'object') {
    // object (e.g. { "0": "a", "1": "b" } or { a: "x", b: "y" })
    const vals = Object.values(value).map(v => (v == null ? '' : String(v))).filter(Boolean);
    return vals as readonly string[];
  }

  if (typeof value === 'string' && value.length > 0) {
    // غيّر الفاصل حسب تنسيق ترجماتك؛ هنا '|' مجرد مثال
    return value.split('|').map(s => s.trim()).filter(Boolean);
  }

  return [];
};
