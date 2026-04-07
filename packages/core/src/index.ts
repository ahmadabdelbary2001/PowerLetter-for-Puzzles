"use client";

export * from './types/game';
export * from './stores/useGameSettingsStore';
export * from './stores/useTeamStore';
export * from './i18n/resources';
export { setupI18n, default as i18n } from './i18n/config';

// Hooks
export * from './hooks/useTranslation';
export * from './hooks/useGameMode';
export * from './hooks/useNotification';

// Config & Constants
export * from './config/gameCategories';

// Feature Hooks
export { useFormationGame } from './features/formation-game/hooks/useFormationGame';
export { useImgChoiceGame } from './features/img-choice-game/hooks/useImgChoiceGame';
export { useImageClueGame } from './features/img-clue-game/hooks/useImageClueGame';
export { useLetterFlowGame } from './features/letter-flow-game/hooks/useLetterFlowGame';
export { usePassiveTouchFix } from './features/letter-flow-game/hooks/usePassiveTouchFix';
export { useOutsideStory } from './features/outside-story-game/hooks/useOutsideStory';
export { usePhraseClueGame } from './features/phrase-clue-game/hooks/usePhraseClueGame';
export { useWordChoiceGame } from './features/word-choice-game/hooks/useWordChoiceGame';
export type { LetterFlowLevel, WordPath, BoardCell } from './features/letter-flow-game/engine';
export type { GridCell, FormationLevel } from './features/formation-game/engine';
export { colorForString } from './features/letter-flow-game/utils/colors';


// Note: UI Components and Contexts have been moved to @powerletter/ui
