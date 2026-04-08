// src/games/engine/GameEngineFactory.ts
/**
 * @description A factory for game engines that follows the Open-Closed Principle.
 * Engines can be registered dynamically, avoiding the need for a large switch statement.
 * This pattern ensures that adding a new game type does not require modifying this file.
 */
import type { GameType } from '@powerletter/core';

// A private registry of game engines.
const engineRegistry: Map<GameType, any> = new Map();

/**
 * Registers an engine for a specific game type.
 */
export function registerGameEngine(gameId: GameType, engine: any) {
  engineRegistry.set(gameId, engine);
}

/**
 * Retrieves an engine for a specific game type.
 */
export function getGameEngine(gameId: GameType) {
  const engine = engineRegistry.get(gameId);
  
  if (!engine) {
    throw new Error(`Engine for game '${gameId}' is not registered. Ensure it is imported before use.`);
  }

  return engine;
}

// Note: Initialization of existing engines should be moved to a centralized bootstrapper 
// or handled via static imports in their feature directories.
