// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import Sonner from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom"; 
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import GameTypeSelector from "./pages/GameTypeSelector";
import { ThemeProvider } from "./contexts/ThemeProvider";
import GameModeSelector from "./components/GameSetup/GameModeSelector";
import KidsGameModeSelector from "./components/GameSetup/KidsGameModeSelector";
import TeamConfigurator from "./components/GameSetup/TeamConfigurator";
import ClueGameScreen from "./components/GameScreens/ClueGame/ClueGameScreen";
import ImgClueGameScreen from "./components/GameScreens/ImgClueGame/ImgClueGameScreen";
import KidsGameSelector from "./pages/KidsGameSelector";

const queryClient = new QueryClient();

const GameModeSelectorWrapper = () => {
  const { gameType } = useParams<{ gameType: string }>();
  const isKidsGame = gameType === 'image-clue' || gameType === 'word-choice' || gameType === 'picture-choice';
  return isKidsGame ? <KidsGameModeSelector /> : <GameModeSelector />;
};

// FIX: Create a new wrapper for the actual game screen
const GameScreenWrapper = () => {
  const { gameType } = useParams<{ gameType: string }>();
  const isKidsGame = gameType === 'image-clue';
  return isKidsGame ? <ImgClueGameScreen /> : <ClueGameScreen />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename="/PowerLetter-for-Puzzles">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/games" element={<GameTypeSelector onGameTypeSelect={() => {}} onBack={() => {}} />} />
            <Route path="/kids-games" element={<KidsGameSelector />} />
            <Route path="/game-mode/:gameType" element={<GameModeSelectorWrapper />} />
            <Route path="/team-config/:gameType" element={<TeamConfigurator />} />
            <Route path="/game/:gameType" element={<GameScreenWrapper />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
