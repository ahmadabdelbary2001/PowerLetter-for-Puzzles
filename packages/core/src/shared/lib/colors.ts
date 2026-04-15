// src/features/letter-flow-game/utils/colors.ts
/**
 * @deprecated Use boardService.colorForString from entities/service/LetterFlowBoardService instead
 * This file is kept for backward compatibility during migration
 */

import { letterFlowBoardService as boardService } from '@core/entities/service/LetterFlowBoardService';

/**
 * @deprecated Use boardService.colorForString instead
 */
export function colorForString(s: string | undefined | null) {
  return boardService.colorForString(s);
}
