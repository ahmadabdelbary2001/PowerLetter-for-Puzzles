"use client";

/**
 * @description The main entry point and layout component for the application.
 * Framework-agnostic version that works in both Next.js and Vite shell.
 * Restored to original styling from PowerLetter-for-Puzzles-old.
 */
import { useEffect } from "react";
import { useGameMode, useTranslation } from "@powerletter/core";
import { Header } from '@ui/organisms/Header';
import { Footer } from '@ui/organisms/Footer';
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
      {/* Header component */}
      <Header currentView={currentView as any} />

      {/* Main content area */}
      <main className="flex-1 min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)]">
        {currentView === "home" && <HeroSection />}
        {currentView === "selection" && <GameTypeSelector />}
      </main>

      {/* Footer component */}
      <Footer />
    </div>
  );
};

export default Index;
