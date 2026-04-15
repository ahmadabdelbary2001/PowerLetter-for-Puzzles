import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ColorScheme = 'light' | 'dark' | 'system';
export type AccentColor =
  | 'violet'
  | 'blue'
  | 'emerald'
  | 'orange'
  | 'rose'
  | 'amber';
export type FontSize = 'sm' | 'md' | 'lg';
export type BorderRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';

interface ThemeState {
  colorScheme: ColorScheme;
  accentColor: AccentColor;
  fontSize: FontSize;
  borderRadius: BorderRadius;
  reducedMotion: boolean;
  highContrast: boolean;

  setColorScheme: (scheme: ColorScheme) => void;
  setAccentColor: (color: AccentColor) => void;
  setFontSize: (size: FontSize) => void;
  setBorderRadius: (radius: BorderRadius) => void;
  setReducedMotion: (value: boolean) => void;
  setHighContrast: (value: boolean) => void;
  resetTheme: () => void;
}

const DEFAULT_THEME: Pick<
  ThemeState,
  'colorScheme' | 'accentColor' | 'fontSize' | 'borderRadius' | 'reducedMotion' | 'highContrast'
> = {
  colorScheme: 'system',
  accentColor: 'violet',
  fontSize: 'md',
  borderRadius: 'md',
  reducedMotion: false,
  highContrast: false,
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      ...DEFAULT_THEME,

      setColorScheme: (colorScheme) => set({ colorScheme }),
      setAccentColor: (accentColor) => set({ accentColor }),
      setFontSize: (fontSize) => set({ fontSize }),
      setBorderRadius: (borderRadius) => set({ borderRadius }),
      setReducedMotion: (reducedMotion) => set({ reducedMotion }),
      setHighContrast: (highContrast) => set({ highContrast }),
      resetTheme: () => set(DEFAULT_THEME),
    }),
    { name: 'powerletter-theme-storage' }
  )
);
