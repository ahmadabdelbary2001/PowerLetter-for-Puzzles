// src/games/engine/bootstrap.ts
/**
 * @description Centralized bootstrapper for registering all game engines.
 * This ensures that when the application starts, all feature-specific engines 
 * are correctly registered in the GameEngineFactory.
 */
import { registerGameEngine } from './GameEngineFactory';
import { letterFlowGameEngine } from '@core/features/games/engine/letter-flow-gameEngine';
import { phraseClueGameEngine } from '@core/features/games/engine/phrase-clue-gameEngine';
import { formationGameEngine } from '@core/features/games/engine/formation-gameEngine';
import { imgClueGameEngine } from '@core/features/games/engine/img-clue-gameEngine';
import { outsideStoryGameEngine } from '@core/features/games/engine/outside-story-gameEngine';
import { imgChoiceGameEngine } from '@core/features/games/engine/img-choice-gameEngine';
import { wordChoiceGameEngine } from '@core/features/games/engine/word-choice-gameEngine';

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
