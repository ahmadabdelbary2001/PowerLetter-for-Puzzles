// src/i18n.ts
/**
 * @description The central configuration file for the i18next library.
 * It imports all translation namespaces, combines them into a single resource
 * object, and initializes the i18next instance with language detection,
 * suspense for React, and other standard settings.
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// static JSON resources (local files)
// --- Import all namespaces for English ---
import enCommon from './locales/en/common.json';
import enFooter from './locales/en/footer.json';
import enGames from './locales/en/games.json';
import enLanding from './locales/en/landing.json';
import enOutsideStory from './locales/en/outside_the_story.json';
import enSelection from './locales/en/selection.json';
import enTeam from './locales/en/team.json';
import enNotification from './locales/en/notification.json';

// --- Import all namespaces for Arabic ---
import arCommon from './locales/ar/common.json';
import arFooter from './locales/ar/footer.json';
import arGames from './locales/ar/games.json';
import arLanding from './locales/ar/landing.json';
import arOutsideStory from './locales/ar/outside_the_story.json';
import arSelection from './locales/ar/selection.json';
import arTeam from './locales/ar/team.json';
import arNotification from './locales/ar/notification.json';

// --- Combine all namespaces into the main resources object ---
const resources = {
  en: {
    common: enCommon,
    footer: enFooter,
    games: enGames,
    landing: enLanding,
    outside_the_story: enOutsideStory,
    selection: enSelection,
    team: enTeam,
    notification: enNotification,
  },
  ar: {
    common: arCommon,
    footer: arFooter,
    games: arGames,
    landing: arLanding,
    outside_the_story: arOutsideStory,
    selection: arSelection,
    team: arTeam,
    notification: arNotification,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    // --- Define the default and loaded namespaces ---
    ns: ['common', 'footer', 'games', 'landing', 'outside_the_story', 'selection', 'team', 'notification'],
    defaultNS: 'common', // Set a default to avoid needing to specify it everywhere
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