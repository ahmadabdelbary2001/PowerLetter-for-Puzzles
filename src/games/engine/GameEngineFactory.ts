// src/games/engine/GameEngineFactory.ts
import { clueGameEngine } from '@/features/clue-game/engine';
import { formationGameEngine } from '@/features/formation-game/engine';
import { imgClueGameEngine } from '@/features/img-clue-game/engine';
import { letterFlowGameEngineInstance } from '@/features/letter-flow-game/engine';
import { outsideStoryGameEngine } from '@/features/outside-story-game/engine';
import { pictureChoiceGameEngine } from '@/features/picture-choice-game/engine';
import { wordChoiceGameEngine } from '@/features/word-choice-game/engine';
import type { GameConfig } from '../GameRegistry';

export function getGameEngine(gameId: GameConfig['id']) {
  switch (gameId) {
    case 'clue':
      return clueGameEngine;
    case 'formation':
      return formationGameEngine;
    case 'image-clue':
      return imgClueGameEngine;
    case 'letter-flow':
      return letterFlowGameEngineInstance;
    case 'picture-choice':
      return pictureChoiceGameEngine;
    case 'outside-the-story':
      return outsideStoryGameEngine;
    case 'word-choice':
      return wordChoiceGameEngine;
    case 'category':
      throw new Error(`Engine for game 'category' is not yet implemented.`);
    default: {
      const exhaustiveCheck: never = gameId;
      throw new Error(`Unhandled game engine for game: ${exhaustiveCheck}`);
    }
  }
}
