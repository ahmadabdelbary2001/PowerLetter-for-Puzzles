// src/hooks/useTranslation.ts
import { useEffect, useMemo } from 'react';
import { useTranslation as useI18nextHook } from 'react-i18next';
import { useGameMode } from '@/hooks/useGameMode';

/**
 * useTranslation - wrapper around react-i18next hook
 * Keeps language synced with global state and supports t.key access
 */
export function useTranslation() {
  const { language: appLang } = useGameMode();
  const { t: i18nT, i18n } = useI18nextHook();

  // Sync i18n language with app state
  useEffect(() => {
    if (!appLang) return;
    if (i18n.language !== appLang) {
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

  // Proxy: allow `t.back` → i18n.t('back')
  const t = useMemo(() => {
    const proxy = new Proxy(
      {},
      {
        get: (_target, prop: string | symbol) => {
          if (typeof prop !== 'string') return undefined;
          return i18nT(prop);
        },
      }
    );
    return proxy as Record<string, string>;
  }, [i18nT]);

  return { t, dir, i18n, translate: i18nT };
}

export default useTranslation;
