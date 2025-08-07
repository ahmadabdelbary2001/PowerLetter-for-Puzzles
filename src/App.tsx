import { useState } from 'react';
import type { ReactElement } from 'react';
import type { Language } from './types/game';

import './index.css';
import './App.css';

import { ThemeProvider } from './contexts/ThemeProvider';
import { GameModeProvider } from './contexts/GameModeContext';
import { useGameMode } from './hooks/useGameMode';

import ModeToggler from './components/GameSetup/ModeToggler';
import LanguageSelector from './components/GameSetup/LanguageSelector';
import GameModeSelector from './components/GameSetup/GameModeSelector';
import TeamConfigurator from './components/GameSetup/TeamConfigurator';
import GameTypeSelector from './components/GameScreens/GameTypeSelector';
import ClueGameScreen from './components/GameScreens/ClueGame/ClueGameScreen';

// Flow state constants
const FLOW_STATES = {
  LANGUAGE_SELECTION: 'language_selection',
  MODE_SELECTION: 'mode_selection',
  TEAM_SETUP: 'team_setup',
  GAME_TYPE_SELECTION: 'game_type_selection',
  CLUE_GAME: 'clue_game',
  COMING_SOON: 'coming_soon',
} as const;

type FlowState = typeof FLOW_STATES[keyof typeof FLOW_STATES];

function AppContent(): ReactElement {
  const { setLanguage } = useGameMode();
  const [currentFlow, setCurrentFlow] = useState<FlowState>(
    FLOW_STATES.LANGUAGE_SELECTION
  );

  const handleLanguageSelect = (langCode: string): void => {
    setLanguage(langCode as Language);
    setCurrentFlow(FLOW_STATES.MODE_SELECTION);
  };

  const handleModeSelect = (mode: 'single' | 'competitive'): void => {
    setCurrentFlow(
      mode === 'competitive'
        ? FLOW_STATES.TEAM_SETUP
        : FLOW_STATES.GAME_TYPE_SELECTION
    );
  };

  const handleTeamsConfigured = (): void => {
    setCurrentFlow(FLOW_STATES.GAME_TYPE_SELECTION);
  };

  const handleGameTypeSelect = (gameType: string): void => {
    setCurrentFlow(
      gameType === 'clue'
        ? FLOW_STATES.CLUE_GAME
        : FLOW_STATES.COMING_SOON
    );
  };

  const handleBackToLanguage = (): void => {
    setCurrentFlow(FLOW_STATES.LANGUAGE_SELECTION);
  };

  const handleBackToMode = (): void => {
    setCurrentFlow(FLOW_STATES.MODE_SELECTION);
  };

  const handleBackToGameType = (): void => {
    setCurrentFlow(FLOW_STATES.GAME_TYPE_SELECTION);
  };

  const renderScreen = (): ReactElement => {
    switch (currentFlow) {
      case FLOW_STATES.LANGUAGE_SELECTION:
        return <LanguageSelector onLanguageSelect={handleLanguageSelect} />;
      case FLOW_STATES.MODE_SELECTION:
        return (
          <GameModeSelector
            onModeSelect={handleModeSelect}
            onBack={handleBackToLanguage}
          />
        );
      case FLOW_STATES.TEAM_SETUP:
        return (
          <TeamConfigurator
            onTeamsConfigured={handleTeamsConfigured}
            onBack={handleBackToMode}
          />
        );
      case FLOW_STATES.GAME_TYPE_SELECTION:
        return (
          <GameTypeSelector
            onGameTypeSelect={handleGameTypeSelect}
            onBack={handleBackToMode}
          />
        );
      case FLOW_STATES.CLUE_GAME:
        return (
          <ClueGameScreen 
            onBack={handleBackToGameType}
          />
        );
      default:
        return <LanguageSelector onLanguageSelect={handleLanguageSelect} />;
    }
  };

  return <div>{renderScreen()}</div>;
}

export default function App(): ReactElement {
  return (
    <ThemeProvider>
      <GameModeProvider>
        <div className="min-h-screen transition-colors duration-300">
          <ModeToggler />
          <AppContent />
        </div>
      </GameModeProvider>
    </ThemeProvider>
  );
}
