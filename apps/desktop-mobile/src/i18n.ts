import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { resources } from '@powerletter/core';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    ns: ['common', 'footer', 'games', 'landing', 'outside_the_story', 'selection', 'team', 'notification', 'instructions'],
    defaultNS: 'common',
    supportedLngs: ['en', 'ar'],
    debug: import.meta.env.DEV,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: true,
    },
  });

export default i18n;