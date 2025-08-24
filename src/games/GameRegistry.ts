// src/games/GameRegistry.ts
/**
 * @description A central registry for all available games in the application.
 * This file defines the configuration for each game, including its ID, title,
 * description, icon, and associated React component.
 */
import React from 'react';
import { Puzzle, Search, Image as ImageIcon, CheckSquare, SpellCheck, Share2 } from 'lucide-react';

// Lazy load components for better performance
const ClueGameScreen = React.lazy(() => import('@/features/clue-game/components/ClueGameScreen'));
const ImgClueGameScreen = React.lazy(() => import('@/features/img-clue-game/components/ImgClueGameScreen'));
const WordChoiceScreen = React.lazy(() => import('@/features/word-choice-game/components/WordChoiceScreen'));
const FormationGameScreen = React.lazy(() => import('@/features/formation-game/components/FormationGameScreen'));
const LetterFlowGameScreen = React.lazy(() => import('@/features/letter-flow-game/components/LetterFlowGameScreen'));

// This type ensures that any key from the translation file is considered valid.
type TranslationKeys = string;

export interface GameConfig {
  id: 'clue' | 'formation' | 'category' | 'image-clue' | 'word-choice' | 'picture-choice' | 'letter-flow'; // Add new game ID
  type: 'adult' | 'kids';
  titleKey: TranslationKeys;
  descriptionKey: TranslationKeys;
  featuresKey: TranslationKeys;
  component: React.FC;
  icon: React.ReactNode;
  status: 'available' | 'coming-soon';
}

export const GAME_REGISTRY: GameConfig[] = [
  // --- Adult Games ---
  {
    id: 'clue',
    type: 'adult',
    titleKey: 'clueTitle',
    descriptionKey: 'clueDesc',
    featuresKey: 'clueFeatures',
    component: ClueGameScreen,
    icon: React.createElement(Search, { className: "w-8 h-8" }),
    status: 'available',
  },
  {
    id: 'formation',
    type: 'adult',
    titleKey: 'formationTitle',
    descriptionKey: 'formationDesc',
    featuresKey: 'formationFeatures',
    component: FormationGameScreen,
    icon: React.createElement(Puzzle, { className: "w-8 h-8" }),
    status: 'available',
  },
  // Add the new "Word Flow" game to the registry
  {
    id: 'letter-flow',
    type: 'adult',
    titleKey: 'wordFlowTitle',
    descriptionKey: 'wordFlowDesc',
    featuresKey: 'wordFlowFeatures',
    component: LetterFlowGameScreen,
    icon: React.createElement(Share2, { className: "w-8 h-8" }), // Using 'Share2' icon for flow/connection
    status: 'available',
  },
  
  // --- Kids Games ---
  {
    id: 'image-clue',
    type: 'kids',
    titleKey: 'pictureToWordTitle',
    descriptionKey: 'pictureToWordDesc',
    featuresKey: 'pictureToWordFeatures',
    component: ImgClueGameScreen,
    icon: React.createElement(SpellCheck, { className: "w-8 h-8" }),
    status: 'available',
  },
  {
    id: 'word-choice',
    type: 'kids',
    titleKey: 'findTheWordTitle',
    descriptionKey: 'findTheWordDesc',
    featuresKey: 'findTheWordFeatures',
    component: WordChoiceScreen,
    icon: React.createElement(CheckSquare, { className: "w-8 h-8" }),
    status: 'available',
  },
  {
    id: 'picture-choice',
    type: 'kids',
    titleKey: 'findThePictureTitle',
    descriptionKey: 'findThePictureDesc',
    featuresKey: 'findThePictureFeatures',
    component: WordChoiceScreen, // Placeholder component
    icon: React.createElement(ImageIcon, { className: "w-8 h-8" }),
    status: 'coming-soon',
  },
];

// Helper function to find a game config by its ID
export const getGameConfig = (id: string | undefined) => {
  if (!id) return null;
  return GAME_REGISTRY.find(game => game.id === id) || null;
};
