// src/features/outside-story-game/components/OutsideStoryScreen.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { useOutsideStory } from '../hooks/useOutsideStory';
import { OutsideStoryLayout } from '@/components/templates/OutsideStoryLayout';

// Import all the sub-screen components
import RoleRevealHandoffScreen from './screens/RoleRevealHandoffScreen';
import RoleRevealPlayerScreen from './screens/RoleRevealPlayerScreen';
import QuestionIntroScreen from './screens/QuestionIntroScreen';
import QuestionTurnScreen from './screens/QuestionTurnScreen';
import VotingScreen from './screens/VotingScreen';
import OutsiderGuessScreen from './screens/OutsiderGuessScreen';
import ResultsScreen from './screens/ResultsScreen';
import RoundEndScreen from './screens/RoundEndScreen';

const OutsideStoryScreen: React.FC = () => {
  // --- Call the single hook and assign its entire return value to a single constant. ---
  const game = useOutsideStory();

  // --- Destructure the needed properties directly from the 'game' object. ---
  const {
    loadingLevels,
    currentRound,
    notification,
    onClearNotification,
    handleBack,
    t,
    instructions,
  } = game;

  // --- The loading and error handling logic is now consistent with other games. ---
  if (loadingLevels || !currentRound) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4 p-4 text-center">
        <p className="text-xl font-semibold">{t.loading ?? 'Loading...'}</p>
        {/* The back button is now available even during loading. */}
        <Button onClick={handleBack}>{t.back}</Button>
      </div>
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
    <OutsideStoryLayout
      // Pass standard layout props
      title={t.outsideTheStoryTitle}
      onBack={handleBack}
      instructions={instructions}
      notification={notification}
      onClearNotification={onClearNotification}
    >
      {renderScreen()}
    </OutsideStoryLayout>
  );
};

export default OutsideStoryScreen;
