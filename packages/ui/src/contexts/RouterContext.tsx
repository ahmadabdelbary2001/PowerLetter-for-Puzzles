"use client";

import React, { createContext, useContext } from 'react';

/**
 * Universal navigate options compatible with both frameworks
 */
export interface NavigateOptions {
  replace?: boolean;
  scroll?: boolean;
  state?: any;
}

/**
 * Universal router interface
 */
export interface AppRouter {
  push: (href: string, options?: NavigateOptions) => void;
  replace: (href: string, options?: NavigateOptions) => void;
  back: () => void;
  prefetch: (href: string) => void;
}

/**
 * Universal location interface
 */
export interface AppLocation {
  pathname: string;
  search: string;
  hash: string;
  state: any;
}

const RouterContext = createContext<AppRouter | undefined>(undefined);
const LocationContext = createContext<AppLocation | undefined>(undefined);
const ParamsContext = createContext<Record<string, string | undefined>>({});

/**
 * A provider to inject framework-specific routing state.
 */
export const RouterProvider: React.FC<{ 
  router: AppRouter; 
  location: AppLocation;
  params?: Record<string, string | undefined>;
  children: React.ReactNode 
}> = ({ router, location, params = {}, children }) => (
  <RouterContext.Provider value={router}>
    <LocationContext.Provider value={location}>
      <ParamsContext.Provider value={params}>
        {children}
      </ParamsContext.Provider>
    </LocationContext.Provider>
  </RouterContext.Provider>
);

/**
 * Custom hook to get the universal app router
 */
export const useAppRouter = (): AppRouter => {
    const context = useContext(RouterContext);
    if (!context) {
        // Fallback to standard window.location to prevent crashes
        return {
            push: (href) => { window.location.href = href; },
            replace: (href) => { window.location.replace(href); },
            back: () => { window.history.back(); },
            prefetch: () => {},
        };
    }
    return context;
};

/**
 * Custom hook to get the universal app location
 */
export const useAppLocation = (): AppLocation => {
  const context = useContext(LocationContext);
  if (!context) {
    return {
      pathname: typeof window !== 'undefined' ? window.location.pathname : '/',
      search: typeof window !== 'undefined' ? window.location.search : '',
      hash: typeof window !== 'undefined' ? window.location.hash : '',
      state: null,
    };
  }
  return context;
};

/**
 * Custom hook to get the universal app params
 */
export const useAppParams = <T extends Record<string, string | undefined>>(): T => {
  return useContext(ParamsContext) as T;
};
