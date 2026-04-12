import React from 'react';
import { Puzzle, Search, Image as ImageIcon, CheckSquare, SpellCheck, Share2, Users } from 'lucide-react';
import { type GameCategory, GAME_METADATA } from '@powerletter/core';

// --- Lazy-loaded Screen Components (Moved from features to screens) ---
const PhraseClueGameScreen = React.lazy(() => import('../screens/phrase-clue/PhraseClueGameScreen').then(m => ({ default: m.PhraseClueGameScreen })));
const ImgClueGameScreen = React.lazy(() => import('../screens/img-clue/ImgClueGameScreen').then(m => ({ default: m.ImgClueGameScreen })));
const WordChoiceScreen = React.lazy(() => import('../screens/word-choice/WordChoiceScreen').then(m => ({ default: m.WordChoiceScreen })));
const FormationGameScreen = React.lazy(() => import('../screens/formation-game/FormationGameScreen').then(m => ({ default: m.FormationGameScreen })));
const LetterFlowGameScreen = React.lazy(() => import('../screens/letter-flow/LetterFlowGameScreen').then(m => ({ default: m.LetterFlowGameScreen })));
const ImgChoiceScreen = React.lazy(() => import('../screens/img-choice/ImgChoiceScreen').then(m => ({ default: m.ImgChoiceScreen })));
const OutsideStoryScreen = React.lazy(() => import('../screens/outside-story/OutsideStoryScreen').then(m => ({ default: m.OutsideStoryScreen })));

type TranslationKeys = string;
type SupportedSetting = 'teams' | 'difficulty' | 'category';

export interface GameConfig {
  id: 'category' | 'phrase-clue' | 'formation' | 'image-clue' | 'letter-flow' | 'outside-the-story' | 'img-choice' | 'word-choice';
  type: 'adult' | 'kids';
  titleKey: TranslationKeys;
  descriptionKey: TranslationKeys;
  featuresKey: TranslationKeys;
  component: React.LazyExoticComponent<React.FC<any>>; // More specific for lazy components
  icon: React.ReactNode;
  status: 'available' | 'coming-soon';
  supportedSettings: SupportedSetting[];
  availableCategories?: GameCategory[];
}

export const GAME_REGISTRY: GameConfig[] = [
  // --- Adult Games ---
  {
    ...GAME_METADATA.find(m => m.id === 'phrase-clue')!,
    titleKey: 'phraseClueTitle',
    descriptionKey: 'phraseClueDesc',
    featuresKey: 'phraseClueFeatures',
    component: PhraseClueGameScreen,
    icon: React.createElement(Search, { className: "w-8 h-8" }),
    status: 'available',
  },
  {
    ...GAME_METADATA.find(m => m.id === 'formation')!,
    titleKey: 'formationTitle',
    descriptionKey: 'formationDesc',
    featuresKey: 'formationFeatures',
    component: FormationGameScreen,
    icon: React.createElement(Puzzle, { className: "w-8 h-8" }),
    status: 'available',
  },
  {
    ...GAME_METADATA.find(m => m.id === 'letter-flow')!,
    titleKey: 'letterFlowTitle',
    descriptionKey: 'letterFlowDesc',
    featuresKey: 'letterFlowFeatures',
    component: LetterFlowGameScreen,
    icon: React.createElement(Share2, { className: "w-8 h-8" }),
    status: 'available',
  },
  {
    ...GAME_METADATA.find(m => m.id === 'outside-the-story')!,
    titleKey: 'outsideTheStoryTitle',
    descriptionKey: 'outsideTheStoryDesc',
    featuresKey: 'outsideTheStoryFeatures',
    component: OutsideStoryScreen,
    icon: React.createElement(Users, { className: "w-8 h-8" }),
    status: 'available',
  },
  
  // --- Kids Games ---
  {
    ...GAME_METADATA.find(m => m.id === 'image-clue')!,
    titleKey: 'imgClueTitle',
    descriptionKey: 'imgClueDesc',
    featuresKey: 'imgClueFeatures',
    component: ImgClueGameScreen,
    icon: React.createElement(SpellCheck, { className: "w-8 h-8" }),
    status: 'available',
  },
  {
    ...GAME_METADATA.find(m => m.id === 'img-choice')!,
    titleKey: 'imgChoiceTitle',
    descriptionKey: 'imgChoiceDesc',
    featuresKey: 'imgChoiceFeatures',
    component: ImgChoiceScreen,
    icon: React.createElement(ImageIcon, { className: "w-8 h-8" }),
    status: 'available',
  },
  {
    ...GAME_METADATA.find(m => m.id === 'word-choice')!,
    titleKey: 'wordChoiceTitle',
    descriptionKey: 'wordChoiceDesc',
    featuresKey: 'wordChoiceFeatures',
    component: WordChoiceScreen,
    icon: React.createElement(CheckSquare, { className: "w-8 h-8" }),
    status: 'available',
  },
];

export const getGameConfig = (id: string | undefined): GameConfig | null => {
  if (!id) return null;
  return GAME_REGISTRY.find(game => game.id === id) || null;
};
