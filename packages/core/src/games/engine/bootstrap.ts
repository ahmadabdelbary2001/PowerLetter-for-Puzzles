// src/games/engine/bootstrap.ts
/**
 * @description Centralized bootstrapper for registering all game engines.
 * This ensures that when the application starts, all feature-specific engines 
 * are correctly registered in the GameEngineFactory.
 */
import { registerGameEngine } from './GameEngineFactory';
import { letterFlowGameEngine } from '@core/features/letter-flow-game/engine';
import { phraseClueGameEngine } from '@core/features/phrase-clue-game/engine';
import { formationGameEngine } from '@core/features/formation-game/engine';
import { imgClueGameEngine } from '@core/features/img-clue-game/engine';
import { outsideStoryGameEngine } from '@core/features/outside-story-game/engine';
import { imgChoiceGameEngine } from '@core/features/img-choice-game/engine';
import { wordChoiceGameEngine } from '@core/features/word-choice-game/engine';

/**
 * Initializes the engine registry with all known game engines.
 */
export function bootstrapEngines() {
  registerGameEngine('letter-flow', letterFlowGameEngine);
  registerGameEngine('phrase-clue', phraseClueGameEngine);
  registerGameEngine('formation', formationGameEngine);
  registerGameEngine('image-clue', imgClueGameEngine);
  registerGameEngine('outside-the-story', outsideStoryGameEngine);
  registerGameEngine('img-choice', imgChoiceGameEngine);
  registerGameEngine('word-choice', wordChoiceGameEngine);
  
  console.log('PowerLetter Engine Registry Initialized.');
}
