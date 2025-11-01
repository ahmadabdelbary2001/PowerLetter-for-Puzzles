// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// local JSON resources
import en from './locales/en/translation.json';
import ar from './locales/ar/translation.json';

// prepare resources in i18next shape
const resources = {
  en: { translation: en },
  ar: { translation: ar },
};

i18n
  .use(LanguageDetector)       // detect user language (optional but helpful)
  .use(initReactI18next)      // bind to react-i18next
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, // React already escapes
    },
    react: {
      useSuspense: true, // set to false if you prefer not to use Suspense
    },
    // you can tune detection order in LanguageDetector options if needed
  });

export default i18n;
