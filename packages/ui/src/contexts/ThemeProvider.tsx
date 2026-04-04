import React, { useState, useEffect, type ReactNode } from 'react';
import { ThemeContext, type Theme } from './ThemeContext';

/**
 * Props interface for the ThemeProvider component
 */
interface Props {
  /** Child components that will have access to the theme context */
  children: ReactNode;
}

/**
 * ThemeProvider component - Manages theme state and provides it to child components
 * Handles theme persistence in localStorage and applies theme classes to the document
 */
export const ThemeProvider: React.FC<Props> = ({ children }) => {
  // State for the current theme, initialized from localStorage or defaulting to 'light'
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('powerletter-theme');
    return stored === 'dark' ? 'dark' : 'light';
  });

  // Effect to apply theme classes to the document and save to localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('powerletter-theme', theme);
  }, [theme]);

  // Function to toggle between light and dark themes
  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  // Provide theme context value to all child components
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
};
