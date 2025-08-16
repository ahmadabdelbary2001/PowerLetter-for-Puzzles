// src/App.tsx
import { Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import Sonner from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import GameTypeSelector from "./pages/GameTypeSelector";
import { ThemeProvider } from "./contexts/ThemeProvider";
import GameModeSelector from "./components/setup/GameModeSelector";
import KidsGameModeSelector from "./components/setup/KidsGameModeSelector";
import TeamConfigurator from "./components/setup/TeamConfigurator";
import KidsGameSelector from "./pages/KidsGameSelector";
import { getGameConfig } from './games/GameRegistry';

const queryClient = new QueryClient();

// Wrapper to select the correct Game Mode Selector (Adult vs Kids)
const GameModeSelectorWrapper = () => {
  const { gameType } = useParams<{ gameType: string }>();
  const config = getGameConfig(gameType);
  
  if (config?.type === 'kids') {
    return <KidsGameModeSelector />;
  }
  return <GameModeSelector />;
};

// Wrapper to select the correct Game Screen Component
const GameScreenWrapper = () => {
  const { gameType } = useParams<{ gameType: string }>();
  const config = getGameConfig(gameType);

  if (!config) {
    return <NotFound />;
  }

  const GameComponent = config.component;
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading Game...</div>}>
      <GameComponent />
    </Suspense>
  );
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
            <Route path="/games" element={<GameTypeSelector />} />
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
