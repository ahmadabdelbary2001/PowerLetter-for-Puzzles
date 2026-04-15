'use client';

import '@/lib/i18n';
import { ReactNode, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';

/**
 * Detects the user's preferred language after client-side hydration and
 * switches i18n to it. This runs AFTER hydration, so it never causes a
 * server/client mismatch — React has already reconciled the DOM by then.
 */
function usePostHydrationLanguage() {
  useEffect(() => {
    const SUPPORTED = ['en', 'ar'];
    // Priority: localStorage saved preference → browser language → default 'en'
    const savedLng = localStorage.getItem('i18nextLng');
    const browserLng = navigator.language?.split('-')[0];
    const target = SUPPORTED.includes(savedLng ?? '') 
      ? savedLng! 
      : SUPPORTED.includes(browserLng) 
        ? browserLng 
        : 'en';

    if (target !== i18n.language) {
      i18n.changeLanguage(target);
    }
  }, []);
}

export function I18nProvider({ children }: { children: ReactNode }) {
  usePostHydrationLanguage();
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
