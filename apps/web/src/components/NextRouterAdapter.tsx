"use client";

import React, { useMemo } from 'react';
import { useRouter, usePathname, useSearchParams, useParams } from 'next/navigation';
import { RouterProvider, LinkProvider } from '@powerletter/ui';
import Link from 'next/link';

/**
 * Platform-specific Router Adapter for Next.js
 */
export const NextRouterAdapter = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const nextParams = useParams();

  // Next.js Catch-All route places dynamic segments in a 'slug' array.
  // We need to map the Next.js `pathname` into our unified param names:
  const params = useMemo(() => {
    const rawParams: Record<string, string | undefined> = { ...nextParams } as any;
    const parts = pathname.split('/').filter(Boolean);
    
    // Pattern Matching for legacy dynamic segments:
    if (parts[0] === 'game-mode' && parts[1]) rawParams.gameType = parts[1];
    if (parts[0] === 'game' && parts[1]) rawParams.gameType = parts[1];
    if (parts[0] === 'team-config' && parts[1]) rawParams.gameType = parts[1];
    if (parts[0] === 'settings') {
      if (parts[1] === 'teams' && parts[2]) rawParams.gameType = parts[2];
      else if (parts[1] && parts[2]) {
        rawParams.settingType = parts[1];
        rawParams.gameType = parts[2];
      }
    }
    
    return rawParams;
  }, [pathname, nextParams]);

  const appRouter = useMemo(() => ({
    push: (href: string) => router.push(href),
    replace: (href: string) => router.replace(href),
    back: () => router.back(),
    prefetch: (href: string) => router.prefetch(href),
  }), [router]);

  const appLocation = useMemo(() => ({
    pathname: pathname || '/',
    search: searchParams?.toString() ? `?${searchParams.toString()}` : '',
    hash: '', // Next.js doesn't provide hash easily in server/client navigation
    state: null,
  }), [pathname, searchParams]);

  const appParams = useMemo(() => params, [params]);

  return (
    <RouterProvider router={appRouter} location={appLocation} params={appParams}>
      <LinkProvider component={Link as any}>
        {children}
      </LinkProvider>
    </RouterProvider>
  );
};
