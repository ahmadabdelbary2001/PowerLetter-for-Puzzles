// src/types/game.ts
// Re-export from the shared @powerletter/core package.
// All game domain types now live in packages/core — this file keeps
// backward compatibility for any local imports that haven't migrated yet.
export type {
  Language,
  GameMode,
  GameType,
  Difficulty,
  AgeGroup,
  GameCategory,
  GameId,
  GameLevel,
  IGameEngine,
  Team,
  Scores,
  GameState,
  GameRegistryEntry,
  LessonType,
  AnimalLesson,
  CountryLesson,
  VocabularyLesson,
  Lesson,
} from '@powerletter/core';
