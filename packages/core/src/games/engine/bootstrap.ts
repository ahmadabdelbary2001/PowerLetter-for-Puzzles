// src/games/engine/bootstrap.ts
/**
 * @description Centralized bootstrapper for registering all game engines.
 * This ensures that when the application starts, all feature-specific engines 
 * are correctly registered in the GameEngineFactory.
 */
import { registerGameEngine } from './GameEngineFactory';
import { letterFlowGameEngine } from '@/features/letter-flow-game/engine';
import { phraseClueGameEngine } from '@/features/phrase-clue-game/engine';
import { formationGameEngine } from '@/features/formation-game/engine';
import { imgClueGameEngine } from '@/features/img-clue-game/engine';
import { outsideStoryGameEngine } from '@/features/outside-story-game/engine';
import { imgChoiceGameEngine } from '@/features/img-choice-game/engine';
import { wordChoiceGameEngine } from '@/features/word-choice-game/engine';

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
