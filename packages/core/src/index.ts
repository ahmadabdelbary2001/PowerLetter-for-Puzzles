// Shared - Types
export * from "./shared/types/game";

// Entities - Stores
export * from "./entities/game/model/gameSettingsStore";
export * from "./entities/team/model/teamStore";
export * from "./entities/user/model/userStore";

// Shared - Internalization
export * from "./i18n/resources";
export { setupI18n, default as i18n } from "./i18n/config";

// Shared - Hooks
export * from "./shared/hooks/useTranslation";
export * from "./shared/hooks/useGameMode";
export * from "./shared/hooks/useNotification";

// Entities - Config & Constants
export * from "./entities/game/config/gameCategories";

// Features - Engine Factory & Discovery
export {
  getGameEngine,
  registerGameEngine,
} from "./features/games/engine/GameEngineFactory";
export { bootstrapEngines } from "./features/games/engine/bootstrap";

// Auto-bootstrap standard engines
import { bootstrapEngines as initEngines } from "./features/games/engine/bootstrap";
initEngines();

// Shared - Feature Hooks (Relocated to shared/hooks)
export { useFormationGame } from "./shared/hooks/game/useFormationGame";
export { useImgChoiceGame } from "./shared/hooks/game/useImgChoiceGame";
export { useImageClueGame } from "./shared/hooks/game/useImageClueGame";
export { useLetterFlowGame } from "./shared/hooks/game/useLetterFlowGame";
export { usePassiveTouchFix } from "./shared/hooks/game/usePassiveTouchFix";
export { useOutsideStory } from "./shared/hooks/game/useOutsideStory";
export type { UseOutsideStoryResult } from "./shared/hooks/game/useOutsideStory";
export { usePhraseClueGame } from "./shared/hooks/game/usePhraseClueGame";
export { useWordChoiceGame } from "./shared/hooks/game/useWordChoiceGame";

// Shared - Engine Types
export type {
  LetterFlowLevel,
  WordPath,
  BoardCell,
} from "./features/games/engine/letter-flow-gameEngine";
export type {
  GridCell,
  FormationLevel,
} from "./features/games/engine/formation-gameEngine";

// Shared - Utilities
export { colorForString } from "./shared/lib/colors";

// Note: UI Components and Contexts have been moved to @powerletter/ui
