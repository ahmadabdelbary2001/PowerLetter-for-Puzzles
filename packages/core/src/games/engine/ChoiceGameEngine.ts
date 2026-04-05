// src/games/engine/ChoiceGameEngine.ts
/**
 * @description A specialized abstract base class for "choice-style" game engines.
 * It extends the foundational BaseGameEngine and adds shared logic for validating
 * choice-based levels, such as ensuring the solution is always in the options.
 */
import type { GameLevel } from '@powerletter/core';
import { BaseGameEngine } from './BaseGameEngine';

export interface ChoiceLevel extends GameLevel {
  solution: string;
  options: string[];
}


export abstract class ChoiceGameEngine<T extends ChoiceLevel> extends BaseGameEngine<T> {
  // Provide a concrete implementation for level validation, as it's also shared.
  protected validateLevel(levelData: unknown): T | null {
    const levelObj = levelData as Record<string, unknown>;
    if (
      levelObj && typeof levelObj === 'object' &&
      'id' in levelObj && 'solution' in levelObj && 'options' in levelObj &&
      Array.isArray(levelObj.options)
    ) {
      const options = levelObj.options as string[];
      const solution = levelObj.solution as string;
      const finalOptions = new Set(options);
      finalOptions.add(solution);
      levelObj.options = Array.from(finalOptions);
      return levelObj as T;
    }
    return null;
  }

  // Provide a concrete error level for all choice games.
  protected getErrorLevel(): T {
    return {
      id: 'error-level',
      solution: 'ERROR',
      options: ['Error'],
    } as T;
  }
}
