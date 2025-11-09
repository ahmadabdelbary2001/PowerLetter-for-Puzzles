// src/hooks/useGameMode.ts
/**
 * @description The new, central hook for accessing all game state.
 * It is now a simple "assembler" hook that combines the state and actions
 * from the dedicated `useGameSettingsStore` and `useTeamStore`.
 * This provides a single, consistent interface for all components.
 */
import { useGameSettingsStore } from '@/stores/useGameSettingsStore';
import { useTeamStore } from '@/stores/useTeamStore';

export function useGameMode() {
  // 1. Get all state and actions from the settings store.
  const settings = useGameSettingsStore();

  // 2. Get all state and actions from the team store.
  const teams = useTeamStore();

  // 3. Return a single, combined object.
  // We can spread both objects because their properties do not conflict.
  return {
    ...settings,
    ...teams,
  };
}
