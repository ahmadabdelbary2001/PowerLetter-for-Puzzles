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
        <BrowserRouter>
          <Routes>
            <Route path="/PowerLetter-for-Puzzles/" element={<Index />} />
            <Route path="/PowerLetter-for-Puzzles/games" element={<GameTypeSelector onGameTypeSelect={() => {}} onBack={() => {}} />} />
            <Route path="/PowerLetter-for-Puzzles/game-mode/:gameType" element={<GameModeSelector onModeSelect={() => {}} onBack={() => {}} />} />
            <Route path="/PowerLetter-for-Puzzles/team-config/:gameType" element={<TeamConfigurator />} />
            <Route path="/PowerLetter-for-Puzzles/game/:gameType" element={<ClueGameScreen onBack={() => {}} />} />
            <Route path="/PowerLetter-for-Puzzles/game/:gameType/:language" element={<ClueGameScreen onBack={() => {}} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
