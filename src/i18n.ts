// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// static JSON resources (local files)
import en from './locales/en/translation.json';
import ar from './locales/ar/translation.json';
import enNotification from './locales/en/notification.json';
import arNotification from './locales/ar/notification.json';

const resources = {
  en: { translation: en, notification: enNotification },
  ar: { translation: ar, notification: arNotification },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'ar'],
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: true,
    },
  });

export default i18n;
