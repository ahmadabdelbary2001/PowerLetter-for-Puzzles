// src/games/GameRegistry.ts
import React from 'react';
import { Puzzle, Search, Image as ImageIcon, CheckSquare, SpellCheck, Share2, Users } from 'lucide-react';
import type { GameCategory } from '@/types/game';

const PhraseClueGameScreen = React.lazy(() => import('@/features/phrase-clue-game/components/PhraseClueGameScreen'));
const ImgClueGameScreen = React.lazy(() => import('@/features/img-clue-game/components/ImgClueGameScreen'));
const WordChoiceScreen = React.lazy(() => import('@/features/word-choice-game/components/WordChoiceScreen'));
const FormationGameScreen = React.lazy(() => import('@/features/formation-game/components/FormationGameScreen'));
const LetterFlowGameScreen = React.lazy(() => import('@/features/letter-flow-game/components/LetterFlowGameScreen'));
const ImgChoiceScreen = React.lazy(() => import('@/features/img-choice-game/components/ImgChoiceScreen'));
const OutsideStoryScreen = React.lazy(() => import('@/features/outside-story-game/components/OutsideStoryScreen'));

type TranslationKeys = string;
type SupportedSetting = 'teams' | 'difficulty' | 'category';

export interface GameConfig {
  id: 'category' | 'phrase-clue' | 'formation' | 'image-clue' | 'letter-flow' | 'outside-the-story' | 'img-choice' | 'word-choice';
  type: 'adult' | 'kids';
  titleKey: TranslationKeys;
  descriptionKey: TranslationKeys;
  featuresKey: TranslationKeys;
  component: React.FC;
  icon: React.ReactNode;
  status: 'available' | 'coming-soon';
  supportedSettings: SupportedSetting[];
  availableCategories?: GameCategory[];
}

export const GAME_REGISTRY: GameConfig[] = [
  // --- Adult Games ---
  {
    id: 'phrase-clue',
    type: 'adult',
    titleKey: 'phraseClueTitle',
    descriptionKey: 'phraseClueDesc',
    featuresKey: 'phraseClueFeatures',
    component: PhraseClueGameScreen,
    icon: React.createElement(Search, { className: "w-8 h-8" }),
    status: 'available',
    supportedSettings: ['teams', 'difficulty', 'category'],
    // --- Added 'clothes' to the list of available categories. ---
    availableCategories: ['animals', 'science', 'geography', 'general'],
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
    availableCategories: [
      'animals', 
      'anime',
      'cars',
      'cartoons',
      'characters',
      'clothes',
      'drinks',
      'foods',
      'football',
      'fruits-and-vegetables',
      'gamers',
      'geography',
      'k-pop',
      'science',
      'series',
      'spy',
      'sweets'
    ],
  },
  
  // --- Kids Games ---
  {
    id: 'image-clue',
    type: 'kids',
    titleKey: 'imgClueTitle',
    descriptionKey: 'imgClueDesc',
    featuresKey: 'imgClueFeatures',
    component: ImgClueGameScreen,
    icon: React.createElement(SpellCheck, { className: "w-8 h-8" }),
    status: 'available',
    supportedSettings: ['teams', 'category'],
    availableCategories: ['animals', 'fruits-and-vegetables', 'shapes', 'general'],
  },
  {
    id: 'img-choice',
    type: 'kids',
    titleKey: 'imgChoiceTitle',
    descriptionKey: 'imgChoiceDesc',
    featuresKey: 'imgChoiceFeatures',
    component: ImgChoiceScreen,
    icon: React.createElement(ImageIcon, { className: "w-8 h-8" }),
    status: 'available',
    supportedSettings: ['teams', 'category'],
    availableCategories: ['animals', 'fruits-and-vegetables', 'shapes', 'general'],
  },
  {
    id: 'word-choice',
    type: 'kids',
    titleKey: 'wordChoiceTitle',
    descriptionKey: 'wordChoiceDesc',
    featuresKey: 'wordChoiceFeatures',
    component: WordChoiceScreen,
    icon: React.createElement(CheckSquare, { className: "w-8 h-8" }),
    status: 'available',
    supportedSettings: ['teams', 'category'],
    availableCategories: ['animals', 'fruits-and-vegetables', 'shapes', 'general'],
  },
];

export const getGameConfig = (id: string | undefined): GameConfig | null => {
  if (!id) return null;
  return GAME_REGISTRY.find(game => game.id === id) || null;
};
