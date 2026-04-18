"use client";

import { createContext, useContext } from 'react';
import type { ThemeId } from '../lib/themes';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The light/dark appearance mode.
 * Separate from `ThemeId` — a theme is the palette, mode is the brightness.
 */
export type Theme = 'light' | 'dark';

/**
 * Full context API exposed to consumers via `useTheme()`.
 *
 * Two orthogonal dimensions:
 * - **themeId** — which colour palette (e.g. `'powerletter'`, `'ocean'`).
 *   Controls the `data-theme` attribute on `<html>`.
 * - **theme / toggleTheme / isDark** — light vs dark mode.
 *   Controls the `.dark` class on `<html>`.
 */
export interface ThemeContextType {
  // ── Mode (light / dark) ──────────────────────────────────────────────────
  /** Current appearance mode: `'light'` or `'dark'`. */
  theme: Theme;
  /** Toggle between light and dark mode. */
  toggleTheme: () => void;
  /** Shorthand boolean — `true` when `theme === 'dark'`. */
  isDark: boolean;

  // ── Theme ID (colour palette) ─────────────────────────────────────────────
  /** Active colour palette identifier (matches `data-theme` on `<html>`). */
  themeId: ThemeId;
  /** Switch to a different colour palette by ID. */
  setThemeId: (id: ThemeId) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

/**
 * React Context for theme management.
 * Provides both mode (light/dark) and palette (themeId) to the component tree.
 */
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Custom hook for accessing the active theme.
 *
 * @throws {Error} If used outside of a `<ThemeProvider>`.
 * @returns The full theme context including palette ID and appearance mode.
 *
 * @example
 * ```tsx
 * const { isDark, themeId, setThemeId, toggleTheme } = useTheme();
 * ```
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
