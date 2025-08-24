// src/games/engine/GameEngineFactory.ts
/**
 * @description A factory function to get the correct game engine based on the game ID.
 * This ensures a decoupled architecture where game screens don't need to know about
 * specific engine implementations.
 */
import { clueGameEngine } from '@/features/clue-game/engine';
import { imgClueGameEngine } from '@/features/img-clue-game/engine';
import { wordChoiceGameEngine } from '@/features/word-choice-game/engine';
import { formationGameEngine } from '@/features/formation-game/engine';
import { letterFlowGameEngineInstance } from '@/features/letter-flow-game/engine'
import type { GameConfig } from '../GameRegistry';

export function getGameEngine(gameId: GameConfig['id']) {
  switch (gameId) {
    case 'clue':
      return clueGameEngine;
    case 'image-clue':
      return imgClueGameEngine;
    case 'word-choice':
      return wordChoiceGameEngine;
    case 'formation':
      return formationGameEngine;
    case 'letter-flow':
      return letterFlowGameEngineInstance;
    
    case 'category':
    case 'picture-choice':
      throw new Error(`Engine for game '${gameId}' is not yet implemented.`);

    default:
      {
        const exhaustiveCheck: never = gameId;
        throw new Error(`Unhandled game engine for game: ${exhaustiveCheck}`);
      }
  }
}
