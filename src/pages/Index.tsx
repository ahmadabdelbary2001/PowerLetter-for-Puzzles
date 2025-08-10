import { useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import HeroSection from "@/pages/HeroSection";
import GameTypeSelector from "@/pages/GameTypeSelector";
import Footer from "@/components/layout/Footer";
import type { Language, GameType } from "@/types/game";
import { useGameMode } from "@/hooks/useGameMode";

const BASE_PATH = "/PowerLetter-for-Puzzles/"; // keep in sync with BrowserRouter basename

const Index = () => {
  const navigate = useNavigate();
  const { gameType, language } = useParams();
  const location = useLocation();
  const { language: currentLanguage, setLanguage, setGameMode } = useGameMode();

  // Determine current view based on route (strip the basename if present)
  const getCurrentView = () => {
    const path = location.pathname.startsWith(BASE_PATH)
      ? location.pathname.slice(BASE_PATH.length) || "/"
      : location.pathname || "/";

    if (path === "/") return "home";
    if (path === "/games") return "selection";
    if (gameType) return "play";
    return "home";
  };

  const currentView = getCurrentView();

  useEffect(() => {
    if (language && (language === "en" || language === "ar")) {
      setLanguage(language as Language);
    }
  }, [language, setLanguage]);

  const handleSelectGame = (selectedGameType: GameType) => {
    setGameMode("single");
    navigate(`/PowerLetter-for-Puzzles/game/${selectedGameType}/${currentLanguage}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col">
      <Header currentView={currentView} />

      <main className="flex-1 min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)]">
        {currentView === "home" && <HeroSection />}

        {currentView === "selection" && (
          <GameTypeSelector onGameTypeSelect={(t) => handleSelectGame(t)} onBack={() => navigate("/PowerLetter-for-Puzzles/")} />
        )}

        {/* other views (play, etc.) will render here */}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
