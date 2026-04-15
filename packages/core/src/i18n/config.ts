"use client";

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { resources } from './resources';

/**
 * Shared I18n Configuration
 * This unified setup ensures consistent translation logic across all applications (Web, Desktop, Mobile).
 */
export const setupI18n = (options: { debug?: boolean } = {}) => {
  if (!i18n.isInitialized) {
    i18n
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        resources,
        fallbackLng: 'en',
        ns: ['common', 'footer', 'games', 'landing', 'outside_the_story', 'selection', 'team', 'notification', 'instructions'],
        defaultNS: 'common',
        supportedLngs: ['en', 'ar'],
        debug: options.debug ?? false,
        interpolation: {
          escapeValue: false, // React already safe from XSS
        },
        react: {
          useSuspense: true,
        },
      });
  }
  return i18n;
};

export default i18n;
