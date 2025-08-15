// src/games/GameRegistry.ts
import ClueGameScreen from '@/components/GameScreens/clue-game/ClueGameScreen';
import ImgClueGameScreen from '@/components/GameScreens/img-clue-game/ImgClueGameScreen';
import WordChoiceScreen from '@/components/GameScreens/word-choice-game/WordChoiceScreen';

// This object maps a gameType to its screen component.
export const GameScreenRegistry: Record<string, React.FC> = {
  'clue': ClueGameScreen,
  'image-clue': ImgClueGameScreen,
  'word-choice': WordChoiceScreen,
  // Add new games here
};
