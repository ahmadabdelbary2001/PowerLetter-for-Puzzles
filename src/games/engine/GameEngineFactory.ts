// src/games/engine/GameEngineFactory.ts
import { clueGameEngine } from '@/features/clue-game/engine';
import { imgClueGameEngine } from '@/features/img-clue-game/engine';
import { wordChoiceGameEngine } from '@/features/word-choice-game/engine';
import { formationGameEngine } from '@/features/formation-game/engine';
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

    // FIX: Handle 'coming-soon' games gracefully.
    // This satisfies the exhaustive check for TypeScript.
    case 'category':
    case 'picture-choice':
      // For games that are coming soon, we can throw a specific error
      // or return a null/mock engine if we want the app to handle it.
      throw new Error(`Engine for game '${gameId}' is not yet implemented.`);

    default:
      // This default case ensures that if a new game ID is added to GameConfig['id']
      // but not handled in this switch, TypeScript will throw a compile-time error.
      {
        const exhaustiveCheck: never = gameId;
        throw new Error(`Unhandled game engine for game: ${exhaustiveCheck}`);
      }
  }
}
