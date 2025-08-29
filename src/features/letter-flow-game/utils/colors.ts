// src/features/letter-flow-game/utils/colors.ts
/**
 * Color utilities for Letter Flow
 *
 * - colorPaletteCount: number of base hues we'll space around the color wheel
 * - colorForString: stable mapping from string to an HSL color, spaced across the palette
 */

const colorPaletteCount = 24; // more slots -> better spreading, choose even number

/**
 * Generate a pleasant HSL string for a given palette index
 * @param index palette index
 */
function hslFromIndex(index: number, total = colorPaletteCount, saturation = 68, lightness = 48) {
  const hue = Math.round((index * 360) / total) % 360;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/**
 * Generate a color based on a string
 *
 * This function uses a small hash then maps into an evenly spaced HSL palette.
 * This ensures colors are far apart around the hue wheel and repeat only after `colorPaletteCount`.
 *
 * @param s - The string to generate a color for
 * @returns CSS color string or undefined if input is empty
 */
export function colorForString(s: string | undefined | null) {
  if (!s) return undefined;

  // Simple deterministic hash (32-bit)
  let hash = 0;
  const up = s.toUpperCase();
  for (let i = 0; i < up.length; i++) {
    hash = ((hash << 5) - hash) + up.charCodeAt(i);
    hash |= 0;
  }

  const idx = Math.abs(hash) % colorPaletteCount;
  return hslFromIndex(idx, colorPaletteCount);
}
