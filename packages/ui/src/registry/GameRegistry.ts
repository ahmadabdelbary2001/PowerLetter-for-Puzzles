import React from 'react';
import { Puzzle, Search, Image as ImageIcon, CheckSquare, SpellCheck, Share2, Users } from 'lucide-react';
import type { GameCategory, GameType } from '@powerletter/core';
import { GAME_METADATA } from '@powerletter/core';

// --- Lazy-loaded Screen Components (Internal UI imports) ---
const PhraseClueGameScreen = React.lazy(() => import('../organisms/games/phrase-clue/PhraseClueGameScreen').then((m: any) => ({ default: m.PhraseClueGameScreen })));
const ImgClueGameScreen = React.lazy(() => import('../organisms/games/img-clue/ImgClueGameScreen').then((m: any) => ({ default: m.ImgClueGameScreen })));
const WordChoiceScreen = React.lazy(() => import('../organisms/games/word-choice/WordChoiceScreen').then((m: any) => ({ default: m.WordChoiceScreen })));
const FormationGameScreen = React.lazy(() => import('../organisms/games/formation-game/FormationGameScreen').then((m: any) => ({ default: m.FormationGameScreen })));
const LetterFlowGameScreen = React.lazy(() => import('../organisms/games/letter-flow/LetterFlowGameScreen').then((m: any) => ({ default: m.LetterFlowGameScreen })));
const ImgChoiceScreen = React.lazy(() => import('../organisms/games/img-choice/ImgChoiceScreen').then((m: any) => ({ default: m.ImgChoiceScreen })));
const OutsideStoryScreen = React.lazy(() => import('../organisms/games/outside-story/OutsideStoryScreen').then((m: any) => ({ default: m.OutsideStoryScreen })));

type TranslationKeys = string;
type SupportedSetting = 'teams' | 'difficulty' | 'category';

export interface GameConfig {
  id: GameType;
  type: 'adult' | 'kids';
  titleKey: TranslationKeys;
  descriptionKey: TranslationKeys;
  featuresKey: TranslationKeys;
  component: React.LazyExoticComponent<React.FC<any>>;
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
