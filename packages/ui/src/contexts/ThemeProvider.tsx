"use client";

import React, { useState, useEffect, useCallback, type ReactNode } from 'react';
import { ThemeContext, type Theme } from './ThemeContext';
import {
  DEFAULT_THEME_ID,
  THEME_ID_STORAGE_KEY,
  THEME_MODE_STORAGE_KEY,
  type ThemeId,
} from '../lib/themes';

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  /** Child components that will have access to the theme context. */
  children: ReactNode;
}

// ─────────────────────────────────────────────────────────────────────────────
// ThemeProvider
// ─────────────────────────────────────────────────────────────────────────────

/**
 * ThemeProvider — Manages both appearance mode (light/dark) and colour palette.
 *
 * How it works:
 * - Sets `data-theme="<themeId>"` on `<html>` → activates the CSS token block
 *   for that palette (defined in globals.css as `[data-theme="<id>"] { … }`).
 * - Adds/removes `.dark` on `<html>` → switches between light and dark variant
 *   of the active palette (`[data-theme="<id>"].dark { … }`).
 * - Persists both values to `localStorage` so the choice survives page refreshes.
 */
export const ThemeProvider: React.FC<Props> = ({ children }) => {
  // ── State ──────────────────────────────────────────────────────────────────
  // Initialise with defaults; real values are loaded from localStorage in the
  // first useEffect to avoid SSR/hydration mismatches.
  const [theme, setTheme] = useState<Theme>('light');
  const [themeId, setThemeIdState] = useState<ThemeId>(DEFAULT_THEME_ID);

  // ── Hydrate from localStorage (runs once on mount) ────────────────────────
  useEffect(() => {
    const storedMode = localStorage.getItem(THEME_MODE_STORAGE_KEY) as Theme | null;
    const storedId = localStorage.getItem(THEME_ID_STORAGE_KEY) as ThemeId | null;

    if (storedMode) setTheme(storedMode);
    if (storedId) setThemeIdState(storedId);
  }, []);

  // ── Apply appearance mode (.dark class) ───────────────────────────────────
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(THEME_MODE_STORAGE_KEY, theme);
  }, [theme]);

  // ── Apply colour palette (data-theme attribute) ───────────────────────────
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeId);
    localStorage.setItem(THEME_ID_STORAGE_KEY, themeId);
  }, [themeId]);

  // ── Actions ────────────────────────────────────────────────────────────────
  /** Toggle between light and dark appearance mode. */
  const toggleTheme = useCallback(
    () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light')),
    [],
  );

  /** Switch the active colour palette. */
  const setThemeId = useCallback((id: ThemeId) => {
    setThemeIdState(id);
  }, []);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <ThemeContext.Provider
      value={{
        // mode
        theme,
        toggleTheme,
        isDark: theme === 'dark',
        // palette
        themeId,
        setThemeId,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
