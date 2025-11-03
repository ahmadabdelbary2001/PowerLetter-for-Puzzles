// src/features/outside-story-game/components/OutsideStoryScreen.tsx
import React from 'react';
import { GameLayout } from '@/components/templates/GameLayout';
import { useTranslation } from '@/hooks/useTranslation';
import { useOutsideStory } from '../hooks/useOutsideStory';

import RoleRevealHandoffScreen from './screens/RoleRevealHandoffScreen';
import RoleRevealPlayerScreen from './screens/RoleRevealPlayerScreen';
import QuestionIntroScreen from './screens/QuestionIntroScreen';
import QuestionTurnScreen from './screens/QuestionTurnScreen';
import VotingScreen from './screens/VotingScreen';
import OutsiderGuessScreen from './screens/OutsiderGuessScreen';
import ResultsScreen from './screens/ResultsScreen';
import RoundEndScreen from './screens/RoundEndScreen';

const OutsideStoryScreen: React.FC = () => {
  const { t } = useTranslation();
  const game = useOutsideStory();

  // MODIFIED: Use the loadingLevels boolean OR check for a currentRound to show a loading state.
  // This is now a reliable way to wait for the game to be ready.
  if (game.loadingLevels || !game.currentRound) {
    return (
      <GameLayout title={t.outsideTheStoryTitle ?? 'Outside the Story'} onBack={() => window.history.back()} levelIndex={0}>
        <div className="w-full h-full flex items-center justify-center p-4 min-h-[50vh]">
          <p className="text-xl">{t.loading ?? 'Loading...'}</p>
        </div>
      </GameLayout>
    );
  }

  const renderScreen = () => {
    switch (game.gameState) {
      case 'role_reveal_handoff':
        return <RoleRevealHandoffScreen game={game} />;
      case 'role_reveal_player':
        return <RoleRevealPlayerScreen game={game} />;
      case 'question_intro':
        return <QuestionIntroScreen game={game} />;
      case 'question_turn':
        return <QuestionTurnScreen game={game} />;
      case 'voting':
        return <VotingScreen game={game} />;
      case 'outsider_guess':
        return <OutsiderGuessScreen game={game} />;
      case 'results':
        return <ResultsScreen game={game} />;
      case 'round_end':
        return <RoundEndScreen game={game} />;
      default:
        // Fallback to a safe state if something goes wrong
        return <RoleRevealHandoffScreen game={game} />;
    }
  };

  return (
    <GameLayout
      title={t.outsideTheStoryTitle ?? 'Outside the Story'}
      onBack={() => window.history.back()}
      layoutType="text"
      levelIndex={0}
    >
      <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-blue-500 text-white rounded-lg min-h-[50vh]">
        {renderScreen()}
      </div>
    </GameLayout>
  );
};

export default OutsideStoryScreen;
