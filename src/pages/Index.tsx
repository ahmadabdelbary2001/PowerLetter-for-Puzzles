// src/pages/Index.tsx
/**
 * @description The main entry point and layout component for the application.
 * This component acts as a router-aware layout that renders the global Header and Footer.
 * It determines which main content to display (e.g., HeroSection or GameTypeSelector)
 * based on the current URL path. It also handles setting the application language
 * if a language code is present in the URL parameters.
 */
import { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Header } from "@/components/organisms/Header";
import HeroSection from "@/pages/HeroSection";
import GameTypeSelector from "@/pages/GameTypeSelector";
import Footer from "@/components/organisms/Footer";
import type { Language } from "@/types/game";
import { useGameMode } from "@/hooks/useGameMode";

/**
 * The Index component serves as the primary page layout.
 * It dynamically renders content based on the route and manages global concerns
 * like language initialization from the URL.
 *
 * @returns {JSX.Element} The rendered page layout with header, dynamic content, and footer.
 */
const Index = () => {
  // Hooks for accessing URL parameters and location
  const { gameType, language } = useParams();
  const location = useLocation();
  const { setLanguage } = useGameMode();

  /**
   * Determines the current view based on the URL pathname.
   * This logic controls which main component is rendered.
   * @returns {'home' | 'selection' | 'play'} A string representing the current view.
   */
  const getCurrentView = () => {
    const path = location.pathname || '/';
    if (path === '/' || path === '') return 'home';
    if (path === '/games') return 'selection';
    if (gameType) return 'play'; // Any route with a gameType param is considered a 'play' view
    return 'home'; // Default fallback
  };

  const currentView = getCurrentView();

  /**
   * An effect that runs when the `language` URL parameter changes.
   * If a valid language ('en' or 'ar') is found, it updates the global state.
   */
  useEffect(() => {
    if (language && (language === "en" || language === "ar")) {
      setLanguage(language as Language);
    }
  }, [language, setLanguage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col">
      {/* Render the global header, passing the current view for active link styling */}
      <Header currentView={currentView} />

      <main className="flex-1 min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)]">
        {/* Conditionally render the main content based on the current view */}
        {currentView === "home" && <HeroSection />}
        {currentView === "selection" && <GameTypeSelector />}
        {/* Other views like the game screen itself are handled by different routes */}
      </main>

      {/* Render the global footer */}
      <Footer />
    </div>
  );
};

export default Index;
