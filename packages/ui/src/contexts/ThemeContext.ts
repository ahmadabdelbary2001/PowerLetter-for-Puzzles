import { createContext, useContext } from 'react';

/**
 * Type definition for available theme options
 */
export type Theme = 'light' | 'dark';

/**
 * Interface defining the shape of the ThemeContext
 * Contains the current theme, a function to toggle it, and a computed boolean for dark mode
 */
export interface ThemeContextType {
  /** Current active theme ('light' or 'dark') */
  theme: Theme;
  /** Function to toggle between light and dark themes */
  toggleTheme: () => void;
  /** Computed boolean indicating if dark mode is active */
  isDark: boolean;
}

/**
 * React Context for theme management
 * Provides theme-related data and functions to components throughout the app
 */
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Custom hook for accessing the theme context
 * Provides a convenient way to consume theme data in components
 * @throws {Error} If used outside of a ThemeProvider
 * @returns {ThemeContextType} The theme context value
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
