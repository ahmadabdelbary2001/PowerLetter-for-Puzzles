// src/hooks/game/useGameContent.ts
/**
 * @description A reusable hook for fetching all UI-related text and content
 * for a specific game, including translations and instructions.
 */
import { useTranslation } from '@/hooks/useTranslation';
import { useInstructions, type InstructionKey } from '@/hooks/useInstructions';

/**
 * @function useGameContent
 * @param gameId The unique identifier for the game (e.g., 'img-clue').
 * @returns An object containing the translation function `t` and the `instructions` data.
 */
export function useGameContent(gameId: InstructionKey) {
  // 1. Fetch all translation functions and data.
  const { t, i18n } = useTranslation();

  // 2. Fetch the raw instruction data for the specific game.
  const rawInstructions = useInstructions(gameId);

  // 3. Process the instructions into a clean, ready-to-use format.
  const instructions = rawInstructions
    ? {
        title: rawInstructions.title ?? '',
        description: rawInstructions.description ?? '',
        steps: rawInstructions.steps ?? [],
      }
    : undefined;

  // 4. Return a single object with all content needed by the UI.
  return { t, i18n, instructions };
}
