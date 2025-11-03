// src/App.tsx
import { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster";
import Sonner from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import GameTypeSelector from "./pages/GameTypeSelector";
import { ThemeProvider } from "./contexts/ThemeProvider";
import GameModeSelector from "./components/organisms/GameModeSelector";
import KidsGameModeSelector from "./components/organisms/KidsGameModeSelector";
import TeamConfigurator from "./pages/TeamConfigurator";
import KidsGameSelector from "./pages/KidsGameSelector";
import { getGameConfig } from './games/GameRegistry';
import '@/i18n';

// Lazily import the new settings page
const GameSettingsPage = lazy(() => import('./pages/GameSettingsPage'));

const queryClient = new QueryClient();

const GameModeSelectorWrapper = () => {
  const { gameType } = useParams<{ gameType: string }>();
  const config = getGameConfig(gameType);
  
  if (config?.type === 'kids') {
    return <KidsGameModeSelector />;
  }
  return <GameModeSelector />;
};

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
          <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/games" element={<GameTypeSelector />} />
              <Route path="/kids-games" element={<KidsGameSelector />} />
              <Route path="/game-mode/:gameType" element={<GameModeSelectorWrapper />} />
              <Route path="/team-config/:gameType" element={<TeamConfigurator />} />
              <Route path="/game/:gameType" element={<GameScreenWrapper />} />
              
              {/* UPDATED: New, unified route for in-game settings changes */}
              <Route path="/change-:settingType/:gameType" element={<GameSettingsPage />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
