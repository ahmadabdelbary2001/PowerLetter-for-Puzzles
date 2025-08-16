// src/games/GameRegistry.ts
import React from 'react';
import { Puzzle, Search, Image as ImageIcon, CheckSquare, BookOpen, SpellCheck } from 'lucide-react';

// Lazy load components for better performance
const ClueGameScreen = React.lazy(() => import('@/features/clue-game/components/ClueGameScreen'));
const ImgClueGameScreen = React.lazy(() => import('@/features/img-clue-game/components/ImgClueGameScreen'));
const WordChoiceScreen = React.lazy(() => import('@/features/word-choice-game/components/WordChoiceScreen'));

// This type ensures that any key from the translation file is considered valid.
type TranslationKeys = string;

export interface GameConfig {
  id: 'clue' | 'formation' | 'category' | 'image-clue' | 'word-choice' | 'picture-choice';
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
  // FIX: Add the "Word Formation" game
  {
    id: 'formation',
    type: 'adult',
    titleKey: 'formationTitle',
    descriptionKey: 'formationDesc',
    featuresKey: 'formationFeatures',
    component: ClueGameScreen, // Placeholder component
    icon: React.createElement(Puzzle, { className: "w-8 h-8" }),
    status: 'coming-soon',
  },
  // FIX: Add the "Category Guess" game
  {
    id: 'category',
    type: 'adult',
    titleKey: 'categoryTitle',
    descriptionKey: 'categoryDesc',
    featuresKey: 'categoryFeatures',
    component: ClueGameScreen, // Placeholder component
    icon: React.createElement(BookOpen, { className: "w-8 h-8" }),
    status: 'coming-soon',
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
