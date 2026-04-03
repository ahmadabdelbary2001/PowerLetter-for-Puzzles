// src/features/outside-story-game/components/OutsideStoryScreen.tsx
/**
 * @description The main entry point for the "Outside the Story" game.
 * This component is wrapped by the `GameScreen` HOC to handle loading and error states.
 * It acts as a router, rendering the correct sub-screen based on the current `gameState`.
 */
import React from 'react';
import { useOutsideStory } from '../hooks/useOutsideStory';
import { OutsideStoryLayout } from '@/components/templates/OutsideStoryLayout';
import { GameScreen } from '@/components/organisms/GameScreen'; // Import the HOC

// Import all the sub-screen components
import RoleRevealHandoffScreen from './screens/RoleRevealHandoffScreen';
import RoleRevealPlayerScreen from './screens/RoleRevealPlayerScreen';
import QuestionIntroScreen from './screens/QuestionIntroScreen';
import QuestionTurnScreen from './screens/QuestionTurnScreen';
import VotingScreen from './screens/VotingScreen';
import OutsiderGuessScreen from './screens/OutsiderGuessScreen';
import ResultsScreen from './screens/ResultsScreen';
import RoundEndScreen from './screens/RoundEndScreen';

// 1. Define the pure UI component. It receives the entire 'game' object from the hook.
const OutsideStoryGame: React.FC<ReturnType<typeof useOutsideStory>> = (game) => {
  const {
    notification,
    onClearNotification,
    handleBack,
    t,
    instructions,
  } = game;

  // This internal router decides which sub-screen to show.
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
      title={t('outsideTheStoryTitle', { ns: 'games' })}
      onBack={handleBack}
      instructions={instructions}
      notification={notification}
      onClearNotification={onClearNotification}
    >
      {renderScreen()}
    </OutsideStoryLayout>
  );
};

// 2. Create the final export by wrapping the pure UI component with the GameScreen HOC.
const OutsideStoryScreen: React.FC = () => (
  <GameScreen useGameHook={useOutsideStory} GameComponent={OutsideStoryGame} />
);

export default OutsideStoryScreen;
