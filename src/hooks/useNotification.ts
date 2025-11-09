// src/hooks/useNotification.ts
/**
 * @description A self-sufficient hook for fetching notification messages.
 * It uses the i18next instance and is scoped only to the 'notification' namespace,
 * providing a dedicated, powerful translation function `t`.
 */
import { useTranslation as useI18nextHook } from 'react-i18next';
import { useGameMode } from './useGameMode';
import { useEffect } from 'react';

export function useNotification() {
  const { language } = useGameMode();
  
  // --- Get the real `t` function, scoped to the 'notification' namespace. ---
  // This function can handle interpolation like t('key', { options }).
  const { t, i18n } = useI18nextHook('notification');

  // Keep the i18next instance synced with our global language state.
  useEffect(() => {
    if (language && i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  // --- Return the actual `t` function directly. ---
  // We rename it to `tNotification` for clarity in the components that use it.
  return { tNotification: t };
}
