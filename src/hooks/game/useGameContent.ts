// src/hooks/game/useGameContent.ts
/**
 * @description A reusable hook for fetching all UI-related text and content
 * for a specific game. It assembles translations from the main `useTranslation` hook,
 * dedicated notification messages from the `useNotification` hook, and game
 * instructions from the `useInstructions` hook.
 */
import { useTranslation } from '@/hooks/useTranslation';
import { useInstructions, type InstructionKey } from '@/hooks/useInstructions';
import { useNotification } from '@/hooks/useNotification';

export function useGameContent(gameId: InstructionKey) {
  // 1. Get the main translation function `t` for general UI text (e.g., "Back", "Level").
  const { t, i18n } = useTranslation();

  // 2. Get the dedicated `tNotification` object for notification-specific text.
  const { tNotification } = useNotification();

  // 3. Get the instruction set for the specific game.
  const rawInstructions = useInstructions(gameId);

  // 4. Process the instructions into a clean, ready-to-use format.
  const instructions = rawInstructions
    ? {
        title: rawInstructions.title ?? '',
        description: rawInstructions.description ?? '',
        steps: rawInstructions.steps ?? [],
      }
    : undefined;

  // 5. Return a single, unified object with all content needed by the UI.
  return {
    t,
    tNotification, // Pass down the dedicated notification translator
    i18n,
    instructions,
  };
}
