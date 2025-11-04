// src/games/GameRegistry.ts
import React from 'react';
import { Puzzle, Search, Image as ImageIcon, CheckSquare, SpellCheck, Share2, Users } from 'lucide-react';
import type { GameCategory } from '@/types/game'; // Import the GameCategory type

const ClueGameScreen = React.lazy(() => import('@/features/clue-game/components/ClueGameScreen'));
const ImgClueGameScreen = React.lazy(() => import('@/features/img-clue-game/components/ImgClueGameScreen'));
const WordChoiceScreen = React.lazy(() => import('@/features/word-choice-game/components/WordChoiceScreen'));
const FormationGameScreen = React.lazy(() => import('@/features/formation-game/components/FormationGameScreen'));
const LetterFlowGameScreen = React.lazy(() => import('@/features/letter-flow-game/components/LetterFlowGameScreen'));
const PictureChoiceScreen = React.lazy(() => import('@/features/picture-choice-game/components/PictureChoiceScreen'));
const OutsideStoryScreen = React.lazy(() => import('@/features/outside-story-game/components/OutsideStoryScreen'));

type TranslationKeys = string;
type SupportedSetting = 'teams' | 'difficulty' | 'category';

export interface GameConfig {
  id: 'category' | 'clue' | 'formation' | 'image-clue' | 'letter-flow' | 'outside-the-story' | 'picture-choice' | 'word-choice';
  type: 'adult' | 'kids';
  titleKey: TranslationKeys;
  descriptionKey: TranslationKeys;
  featuresKey: TranslationKeys;
  component: React.FC;
  icon: React.ReactNode;
  status: 'available' | 'coming-soon';
  supportedSettings: SupportedSetting[];
  // A list of available categories for this specific game
  availableCategories?: GameCategory[];
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
    supportedSettings: ['teams', 'difficulty', 'category'],
    availableCategories: ['animals', 'science', 'geography', 'general'], // Specific categories for this game
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
    supportedSettings: ['teams', 'difficulty'],
    // No categories for this game
  },
  {
    id: 'letter-flow',
    type: 'adult',
    titleKey: 'letterFlowTitle',
    descriptionKey: 'letterFlowDesc',
    featuresKey: 'letterFlowFeatures',
    component: LetterFlowGameScreen,
    icon: React.createElement(Share2, { className: "w-8 h-8" }),
    status: 'available',
    supportedSettings: ['teams', 'difficulty'],
    // No categories for this game
  },
  {
    id: 'outside-the-story',
    type: 'adult',
    titleKey: 'outsideTheStoryTitle',
    descriptionKey: 'outsideTheStoryDesc',
    featuresKey: 'outsideTheStoryFeatures',
    component: OutsideStoryScreen,
    icon: React.createElement(Users, { className: "w-8 h-8" }),
    status: 'available',
    supportedSettings: ['teams', 'category'],
    availableCategories: ['animals', 'science', 'geography', 'fruits'], // Different set of categories
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
    supportedSettings: ['teams', 'category'],
    availableCategories: ['animals', 'fruits', 'shapes', 'general'], // Different set of categories
  },
  {
    id: 'picture-choice',
    type: 'kids',
    titleKey: 'findThePictureTitle',
    descriptionKey: 'findThePictureDesc',
    featuresKey: 'findThePictureFeatures',
    component: PictureChoiceScreen,
    icon: React.createElement(ImageIcon, { className: "w-8 h-8" }),
    status: 'available',
    supportedSettings: ['teams', 'category'],
    availableCategories: ['animals', 'fruits', 'shapes', 'general'], // Different set of categories
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
    supportedSettings: ['teams', 'category'],
    availableCategories: ['animals', 'fruits', 'shapes', 'general'], // Different set of categories
  },
];

export const getGameConfig = (id: string | undefined): GameConfig | null => {
  if (!id) return null;
  return GAME_REGISTRY.find(game => game.id === id) || null;
};
