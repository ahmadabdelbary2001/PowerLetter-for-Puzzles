/**
 * @file themes.ts
 * @description Centralized theme registry for PowerLetter.
 *
 * Architecture Pattern:
 * - Each theme entry defines its `id` (used as the `data-theme` HTML attribute value),
 *   human-readable metadata, and preview swatches for a future theme-picker UI.
 * - CSS tokens for each theme are co-located in `globals.css` under the selector
 *   `[data-theme="<id>"]` for light and `[data-theme="<id>"].dark` for dark.
 * - To add a new theme:
 *   1. Add an entry to the `THEMES` array below.
 *   2. Add the corresponding `[data-theme="<id>"]` and `[data-theme="<id>"].dark`
 *      blocks in `globals.css`.
 *   3. The ThemeProvider and ThemeContext automatically pick it up — no other changes.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Theme Definition
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Metadata for a single theme entry.
 * Used both at runtime (ThemeProvider) and in future UI (ThemePicker).
 */
export interface ThemeDefinition {
  /** Unique theme identifier — must match the CSS `data-theme` attribute value. */
  id: string;
  /** Human-readable name shown in theme picker UI. */
  name: string;
  /** Brief description of the theme's character/mood. */
  description: string;
  /** Preview swatches for the theme-picker UI [primary, secondary, background]. */
  preview: {
    primary: string;
    secondary: string;
    background: string;
    backgroundDark: string;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Theme Registry
// ─────────────────────────────────────────────────────────────────────────────

/**
 * All available themes.
 * Add new themes here + their CSS blocks in globals.css.
 *
 * @example Adding a new theme:
 * ```ts
 * {
 *   id: 'ocean',
 *   name: 'Ocean Blue',
 *   description: 'Cool blues and cyans inspired by the deep ocean.',
 *   preview: {
 *     primary: 'hsl(220, 80%, 50%)',
 *     secondary: 'hsl(180, 70%, 55%)',
 *     background: '#f0f8ff',
 *     backgroundDark: '#0a1628',
 *   },
 * },
 * ```
 */
export const THEMES = [
  {
    id: 'powerletter',
    name: 'PowerLetter',
    description: 'Rich violet & aqua teal — the signature PowerLetter palette.',
    preview: {
      primary: 'hsl(283, 48%, 44%)',
      secondary: 'hsl(207, 90%, 81%)',
      background: '#fafafa',
      backgroundDark: '#141414',
    },
  },
  // ── Future themes (add CSS tokens in globals.css to activate) ──
  // {
  //   id: 'ocean',
  //   name: 'Ocean Blue',
  //   description: 'Cool blues and cyans inspired by the deep ocean.',
  //   preview: {
  //     primary: 'hsl(220, 80%, 50%)',
  //     secondary: 'hsl(180, 70%, 55%)',
  //     background: '#f0f8ff',
  //     backgroundDark: '#0a1628',
  //   },
  // },
  // {
  //   id: 'forest',
  //   name: 'Forest Green',
  //   description: 'Natural greens and warm earth tones.',
  //   preview: {
  //     primary: 'hsl(142, 60%, 38%)',
  //     secondary: 'hsl(38, 80%, 60%)',
  //     background: '#f5f9f0',
  //     backgroundDark: '#0a150d',
  //   },
  // },
] as const satisfies readonly ThemeDefinition[];

// ─────────────────────────────────────────────────────────────────────────────
// Derived Types & Constants
// ─────────────────────────────────────────────────────────────────────────────

/** Union of all valid theme IDs. Automatically widened as THEMES grows. */
export type ThemeId = (typeof THEMES)[number]['id'];

/** The theme applied on first load before localStorage is read. */
export const DEFAULT_THEME_ID: ThemeId = 'powerletter';

/** localStorage key used to persist the active theme ID. */
export const THEME_ID_STORAGE_KEY = 'powerletter-theme-id';

/** localStorage key used to persist the active mode (light/dark). */
export const THEME_MODE_STORAGE_KEY = 'powerletter-theme';

/**
 * Look up a theme by ID. Falls back to the default if the ID is not found
 * (e.g., after a theme is removed in a future version).
 */
export function getThemeById(id: string): ThemeDefinition {
  return (
    THEMES.find((t) => t.id === id) ??
    THEMES.find((t) => t.id === DEFAULT_THEME_ID)!
  );
}
