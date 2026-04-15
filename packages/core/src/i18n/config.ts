"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { resources } from "./resources";

/**
 * Shared I18n Configuration
 * This unified setup ensures consistent translation logic across all applications (Web, Desktop, Mobile).
 *
 * Set `skipDetection: true` in SSR apps (Next.js) to ensure server and client render
 * the same initial language, avoiding React hydration mismatches. Language detection
 * then happens client-side after hydration via `useEffect`.
 */
export const setupI18n = (
  options: {
    debug?: boolean;
    skipDetection?: boolean;
    initialLanguage?: string;
  } = {}
) => {
  if (!i18n.isInitialized) {
    const instance = options.skipDetection
      ? i18n.use(initReactI18next)
      : i18n.use(LanguageDetector).use(initReactI18next);

    instance.init({
      resources,
      fallbackLng: "en",
      lng: options.skipDetection ? options.initialLanguage ?? "en" : undefined,
      ns: [
        "common",
        "footer",
        "games",
        "landing",
        "outside_the_story",
        "selection",
        "team",
        "notification",
        "instructions",
      ],
      defaultNS: "common",
      supportedLngs: ["en", "ar"],
      debug: options.debug ?? false,
      interpolation: {
        escapeValue: false, // React already safe from XSS
      },
      react: {
        useSuspense: true,
      },
    });
  } else if (options.skipDetection) {
    const deterministicLng = options.initialLanguage ?? "en";
    if (i18n.language !== deterministicLng) {
      i18n.changeLanguage(deterministicLng).catch(() => {
        // Keep deterministic SSR flow even if language switch fails silently
      });
    }
  }
  return i18n;
};

export default i18n;
