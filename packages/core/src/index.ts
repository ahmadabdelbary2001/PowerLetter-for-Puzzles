"use client";

export * from './types/game';
export * from './store/slices/gameSettingsStore';
export * from './store/slices/teamStore';
export * from './i18n/resources';
export { setupI18n, default as i18n } from './i18n/config';

// Hooks
export * from './hooks/useTranslation';
export * from './hooks/useGameMode';
export * from './hooks/useNotification';

// Config & Constants
export * from './config/gameCategories';

// Engine Factory & Discovery
export { getGameEngine, registerGameEngine } from './engine/GameEngineFactory';
export { bootstrapEngines } from './engine/bootstrap';

// Auto-bootstrap standard engines
import { bootstrapEngines as initEngines } from './engine/bootstrap';
initEngines();

// Feature Hooks
export { useFormationGame } from './hooks/game/useFormationGame';
export { useImgChoiceGame } from './hooks/game/useImgChoiceGame';
export { useImageClueGame } from './hooks/game/useImageClueGame';
export { useLetterFlowGame } from './hooks/game/useLetterFlowGame';
export { usePassiveTouchFix } from './hooks/game/usePassiveTouchFix';
export { useOutsideStory } from './hooks/game/useOutsideStory';
export { usePhraseClueGame } from './hooks/game/usePhraseClueGame';
export { useWordChoiceGame } from './hooks/game/useWordChoiceGame';
export type { LetterFlowLevel, WordPath, BoardCell } from './engine/letter-flow-gameEngine';
export type { GridCell, FormationLevel } from './engine/formation-gameEngine';
export { colorForString } from './utils/colors';


// Note: UI Components and Contexts have been moved to @powerletter/ui
