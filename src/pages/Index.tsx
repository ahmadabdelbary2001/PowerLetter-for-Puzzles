// src/pages/Index.tsx
import { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import HeroSection from "@/pages/HeroSection";
import GameTypeSelector from "@/pages/GameTypeSelector";
import Footer from "@/components/layout/Footer";
import type { Language } from "@/types/game";
import { useGameMode } from "@/hooks/useGameMode";

const Index = () => {
  const { gameType, language } = useParams();
  const location = useLocation();
  const { setLanguage } = useGameMode();

  // Determine current view based on route (no manual BASE_PATH slicing)
  const getCurrentView = () => {
    const path = location.pathname || '/';
    if (path === '/' || path === '') return 'home';
    if (path === '/games') return 'selection';
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col">
      <Header currentView={currentView} />

      <main className="flex-1 min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)]">
        {currentView === "home" && <HeroSection />}

        {currentView === "selection" && (
          <GameTypeSelector />
        )}

        {/* other views (play, etc.) will render here */}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
