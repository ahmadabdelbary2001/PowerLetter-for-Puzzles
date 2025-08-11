// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import Sonner from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import GameTypeSelector from "./pages/GameTypeSelector";
import { ThemeProvider } from "./contexts/ThemeProvider";
import GameModeSelector from "./components/GameSetup/GameModeSelector";
import TeamConfigurator from "./components/GameSetup/TeamConfigurator";
import ClueGameScreen from "./components/GameScreens/ClueGame/ClueGameScreen";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename="/PowerLetter-for-Puzzles">
          <Routes>
            <Route path="/" element={<Index />} />
            {/* Removed unnecessary props from components */}
            <Route path="/games" element={<GameTypeSelector onGameTypeSelect={() => {}} onBack={() => {}} />} />
            <Route path="/game-mode/:gameType" element={<GameModeSelector />} />
            <Route path="/team-config/:gameType" element={<TeamConfigurator />} />
            <Route path="/game/:gameType" element={<ClueGameScreen />} />
            {/* This second route for language is likely redundant now, but kept for safety */}
            <Route path="/game/:gameType/:language" element={<ClueGameScreen />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;