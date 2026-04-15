"use client";

// src/screens/outside-story/OutsideStoryScreen.tsx
/**
 * @description The main entry point for the "Outside the Story" game.
 * This component is wrapped by the `GameScreen` HOC to handle loading and error states.
 * It acts as a router, rendering the correct sub-screen based on the current `gameState`.
 */
import React from 'react';
import { useOutsideStory } from '@powerletter/core';
import { OutsideStoryLayout } from '@ui/templates/OutsideStoryLayout';
import { GameScreen } from '@ui/organisms/GameScreen';
import { useAppRouter, useAppParams } from '@ui/contexts/RouterContext';

// Import all the sub-screen components
import { RoleRevealHandoffScreen } from './components/RoleRevealHandoffScreen';
import { RoleRevealPlayerScreen } from './components/RoleRevealPlayerScreen';
import { QuestionIntroScreen } from './components/QuestionIntroScreen';
import { QuestionTurnScreen } from './components/QuestionTurnScreen';
import { VotingScreen } from './components/VotingScreen';
import { OutsiderGuessScreen } from './components/OutsiderGuessScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { RoundEndScreen } from './components/RoundEndScreen';

// 1. Define the pure UI component. It receives the entire 'game' object from the hook.
const OutsideStoryGame: React.FC<ReturnType<typeof useOutsideStory>> = (game) => {
  const {
    notification,
    onClearNotification,
    handleBackWith,
    t,
    instructions,
  } = game;

  const router = useAppRouter();
  const { gameType: paramGameType } = useAppParams<{ gameType: string }>();
  const gameType = paramGameType || 'outside-the-story';

  const handleBack = () => handleBackWith(router.push, gameType);

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
export const OutsideStoryScreen: React.FC = () => (
  // @ts-ignore - useGameHook type mismatch due to @powerletter/core import in transition
  <GameScreen useGameHook={useOutsideStory} GameComponent={OutsideStoryGame} />
);
