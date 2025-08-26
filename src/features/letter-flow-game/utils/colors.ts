// src/features/letter-flow-game/utils/colors.ts
/**
 * These colors are used to distinguish between different letters and paths
 * in the game. The colors are chosen to be visually distinct from each other.
 */
export const COLORS = [
  '#FF5733', '#33FF57', '#3357FF', '#F333FF', '#FF33A1',
  '#A133FF', '#33FFF0', '#FFD733', '#33FF96', '#FF9633'
];

/**
 * Generate a color based on a string
 * 
 * This function takes a string and returns a consistent color based on its content.
 * It uses a simple hash function to map the string to one of the predefined colors.
 * This ensures that the same string always gets the same color.
 * 
 * @param s - The string to generate a color for
 * @returns CSS color string or undefined if input is empty
 */
export function colorForString(s: string | undefined | null) {
  if (!s) return undefined;
  
  // Simple hash function to generate a consistent number from the string
  let hash = 0;
  const up = s.toUpperCase();
  for (let i = 0; i < up.length; i++) {
    hash = ((hash << 5) - hash) + up.charCodeAt(i);
    hash |= 0; // Convert to 32-bit integer
  }
  
  // Map the hash to one of the predefined colors
  const idx = Math.abs(hash) % COLORS.length;
  return COLORS[idx];
}