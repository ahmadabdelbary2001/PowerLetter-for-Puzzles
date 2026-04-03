// packages/core/src/i18n/resources.ts
/**
 * @description Centralized resource object for i18next. 
 * This contains all translation namespaces for both English and Arabic.
 */

// --- English Namespaces ---
import enCommon from '../locales/en/common.json';
import enFooter from '../locales/en/footer.json';
import enGames from '../locales/en/games.json';
import enLanding from '../locales/en/landing.json';
import enOutsideStory from '../locales/en/outside_the_story.json';
import enSelection from '../locales/en/selection.json';
import enTeam from '../locales/en/team.json';
import enNotification from '../locales/en/notification.json';
import enInstructions from '../locales/en/instructions.json';

// --- Arabic Namespaces ---
import arCommon from '../locales/ar/common.json';
import arFooter from '../locales/ar/footer.json';
import arGames from '../locales/ar/games.json';
import arLanding from '../locales/ar/landing.json';
import arOutsideStory from '../locales/ar/outside_the_story.json';
import arSelection from '../locales/ar/selection.json';
import arTeam from '../locales/ar/team.json';
import arNotification from '../locales/ar/notification.json';
import arInstructions from '../locales/ar/instructions.json';

export const resources = {
  en: {
    common: enCommon,
    footer: enFooter,
    games: enGames,
    landing: enLanding,
    outside_the_story: enOutsideStory,
    selection: enSelection,
    team: enTeam,
    notification: enNotification,
    instructions: enInstructions,
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
    instructions: arInstructions,
  },
} as const;

export type i18nResources = typeof resources;
export type i18nNamespaces = keyof typeof resources.en;
