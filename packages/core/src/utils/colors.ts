// src/features/letter-flow-game/utils/colors.ts
/**
 * @deprecated Use boardService.colorForString from domain/letter-flow/service instead
 * This file is kept for backward compatibility during migration
 */

import { letterFlowBoardService as boardService } from '@core/domain/game';

/**
 * @deprecated Use boardService.colorForString instead
 */
export function colorForString(s: string | undefined | null) {
  return boardService.colorForString(s);
}
