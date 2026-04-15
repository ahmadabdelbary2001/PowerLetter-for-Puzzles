"use client";

/**
 * @description The main entry point and layout component for the application.
 * Framework-agnostic version that works in both Next.js and Vite shell.
 * Restored to original styling from PowerLetter-for-Puzzles-old.
 */
import { useEffect } from "react";
import { useGameMode, useTranslation } from "@powerletter/core";
import { useAppParams, useAppLocation } from "@ui/contexts/RouterContext";
import HeroSection from "./HeroSection";
import GameTypeSelector from "./GameTypeSelector";
import type { Language } from "@powerletter/core";

const Index = () => {
  const { gameType, language } = useAppParams<{ gameType?: string; language?: string }>();
  const location = useAppLocation();
  const { setLanguage } = useGameMode();
  const { i18n } = useTranslation();

  const getCurrentView = () => {
    const path = location.pathname || '/';
    if (path === '/' || path === '') return 'home';
    if (path.includes('/games')) return 'selection';
    if (gameType) return 'play';
    return 'home';
  };

  const currentView = getCurrentView();

  useEffect(() => {
    if (language && (language === "en" || language === "ar")) {
      setLanguage(language as Language);
    }
  }, [language, setLanguage]);

  return (
    <div
      className="min-h-screen bg-linear-to-br from-background via-background to-muted/20 flex flex-col"
      dir={i18n.dir()}
      suppressHydrationWarning
    >
      <main className="flex-1">
        {currentView === 'home' && <HeroSection />}
        {currentView === 'selection' && <GameTypeSelector />}
        {/* 'play' view is handled by the shell's routing, but we include it here for completeness if needed */}
        {currentView === 'play' && <div>Game screen should be rendered by the shell's router.</div>}
      </main>
    </div>
  );
};

export default Index;
