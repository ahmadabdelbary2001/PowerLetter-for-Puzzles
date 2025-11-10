// src/hooks/useTranslation.ts
/**
 * @description A custom wrapper around the `react-i18next` hook.
 * It synchronizes the i18next language state with the global application state
 * from `useGameMode` and provides a powerful `t` function that can access
 * any translation namespace.
 */
import { useEffect, useMemo } from 'react';
import { useTranslation as useI18nextHook } from 'react-i18next';
import { useGameMode } from '@/hooks/useGameMode';

// --- Define all available namespaces for type safety ---
const namespaces = ['common', 'games', 'landing', 'outside_the_story', 'selection', 'team', 'notification'] as const;

export function useTranslation() {
  const { language: appLang } = useGameMode();
  
  // --- Tell the hook to load all our namespaces ---
  const { t, i18n } = useI18nextHook(namespaces);

  // Sync i18n language with app state
  useEffect(() => {
    if (appLang && i18n.language !== appLang) {
      i18n.changeLanguage(appLang).catch(() => {
        // ignore missing locale errors
      });
    }
  }, [appLang, i18n]);

  // Set document direction + lang attributes for RTL/LTR handling
  useEffect(() => {
    const lang = i18n.language || appLang || 'en';
    const dir = i18n.dir(lang);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      document.documentElement.dir = dir;
    }
  }, [i18n, appLang]);

  const dir = useMemo(
    () => (i18n ? (i18n.dir(i18n.language || appLang || 'en') as 'rtl' | 'ltr') : 'ltr'),
    [i18n, appLang]
  );

  // --- The proxy is no longer needed. We return the real `t` function. ---
  // The real `t` function is more powerful and can handle namespaces.
  // Example: t('myKey', { ns: 'games' })
  return { t, dir, i18n };
}

export default useTranslation;
