import { setupI18n, i18n } from "@powerletter/core";

// Initialize with English for SSR consistency.
// LanguageDetector is skipped here to prevent hydration mismatches between
// the server (which always renders 'en') and the client (which detects 'ar').
// Post-hydration language switching happens in I18nProvider via useEffect.
setupI18n({ skipDetection: true, initialLanguage: 'en' });

export default i18n;
