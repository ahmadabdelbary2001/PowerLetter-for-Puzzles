// src/components/molecules/LetterFlowBoard.tsx
/**
 * LetterFlowBoard component - Renders the game board for the Letter Flow game
 *
 * Responsibilities:
 * - Grid layout for cells
 * - Visual state (selected / found / active)
 * - Connection directions & colors (use endpoint/path colors first)
 */
import { LetterFlowCell } from "@/components/atoms/LetterFlowCell";
import { cn } from "@/lib/utils";
import type { BoardCell } from "@/features/letter-flow-game/engine";
import { colorForString } from "@/features/letter-flow-game/utils/colors";

interface LetterFlowBoardProps {
  cells: BoardCell[];
  selectedPath: BoardCell[]; // use BoardCell so color?: string is available
  foundWords: Array<{
    word: string;
    cells: BoardCell[]; // use BoardCell so color?: string is available
  }>;
  activeLetter: string | null;
  onMouseDown: (cell: {x: number, y: number, letter: string}) => void;
  onMouseEnter: (cell: {x: number, y: number, letter: string}) => void;
  onMouseUp: () => void;
  className?: string;
  dir?: 'ltr' | 'rtl';
}

/**
 * Stable fallback color for letters (used only if no endpoint/path color exists).
 */
function fallbackColorForLetter(letter: string | undefined | null) {
  return colorForString(letter);
}

export function LetterFlowBoard({
  cells,
  selectedPath,
  foundWords,
  activeLetter,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  className,
  dir = 'ltr',
}: LetterFlowBoardProps) {
  const cols = cells.length === 0 ? 0 : Math.max(...cells.map(c => c.x)) + 1;
  const isRTL = dir === 'rtl';

  const cellKey = (c: {x:number,y:number}) => `${c.x}-${c.y}`;

  const selectedMap = new Map<string, BoardCell>();
  selectedPath.forEach(c => selectedMap.set(cellKey(c), c));

  const foundMap = new Map<string, { word: string; cells: BoardCell[] }>();
  foundWords.forEach(path => path.cells.forEach(c => foundMap.set(cellKey(c), { word: path.word, cells: path.cells })));

  // calculate connection directions for a cell (top/right/bottom/left)
  const getConnectionDirections = (cell: BoardCell) => {
    const directions: string[] = [];
    const allPaths: BoardCell[][] = [...foundWords.map(w => w.cells), selectedPath];

    for (const path of allPaths) {
      const index = path.findIndex(c => c.x === cell.x && c.y === cell.y);
      if (index !== -1) {
        // previous
        if (index > 0) {
          const prev = path[index - 1];
          if (prev.x === cell.x - 1 && prev.y === cell.y) directions.push('left');
          if (prev.x === cell.x + 1 && prev.y === cell.y) directions.push('right');
          if (prev.x === cell.x && prev.y === cell.y - 1) directions.push('top');
          if (prev.x === cell.x && prev.y === cell.y + 1) directions.push('bottom');
        }
        // next
        if (index < path.length - 1) {
          const next = path[index + 1];
          if (next.x === cell.x - 1 && next.y === cell.y) directions.push('left');
          if (next.x === cell.x + 1 && next.y === cell.y) directions.push('right');
          if (next.x === cell.x && next.y === cell.y - 1) directions.push('top');
          if (next.x === cell.x && next.y === cell.y + 1) directions.push('bottom');
        }
      }
    }

    return [...new Set(directions)];
  };

  const getConnectionColor = (cell: BoardCell) => {
    // 1) If this cell belongs to a completed found word, prefer that path's color
    for (const wordPath of foundWords) {
      if (wordPath.cells.some(c => c.x === cell.x && c.y === cell.y)) {
        // prefer explicit color on the path
        const explicit = wordPath.cells[0]?.color ?? wordPath.cells.find(c => c.color)?.color;
        if (explicit) return explicit;
        // fallback: try to find this endpoint's color in board cells (cells prop)
        const endpointCell = cells.find(b => b.x === wordPath.cells[0].x && b.y === wordPath.cells[0].y);
        if (endpointCell?.color) return endpointCell.color;
        // last resort: letter-based fallback
        return fallbackColorForLetter(wordPath.word);
      }
    }

    // 2) If this cell is part of the currently selected path, use the selected path's endpoint color
    if (selectedPath && selectedPath.length > 0 && selectedPath.some(c => c.x === cell.x && c.y === cell.y)) {
      // prefer start cell's color
      const start = selectedPath[0];
      if (start?.color) return start.color;
      // look up color from the board endpoints
      const ep = cells.find(b => b.x === start.x && b.y === start.y);
      if (ep?.color) return ep.color;
      // fallback to stable letter-derived color
      return fallbackColorForLetter(start?.letter);
    }

    // 3) Use the cell's own color (for endpoints) if present
    if (cell.color) return cell.color;

    return undefined;
  };

  const isSelected = (cell: BoardCell) => selectedMap.has(cellKey(cell));
  const isFound = (cell: BoardCell) => foundMap.has(cellKey(cell));

  return (
    <div
      className={cn("grid gap-1 mx-auto max-w-md", className, { 'rtl-direction': isRTL })}
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        direction: isRTL ? 'rtl' : 'ltr',
        touchAction: "none"
      }}
    >
      {cells.map((cell) => {
        const connectionDirections = getConnectionDirections(cell);
        const connectionColor = getConnectionColor(cell);
        // If cell is an endpoint different than activeLetter and already used, block it
        const disabled = isFound(cell) || (cell.letter !== '' && cell.letter !== activeLetter && cell.isUsed);

        return (
          <LetterFlowCell
            key={`${cell.x}-${cell.y}`}
            letter={cell.letter}
            x={cell.x}
            y={cell.y}
            isSelected={isSelected(cell)}
            isFound={isFound(cell)}
            isActive={activeLetter && cell.letter === activeLetter ? true : undefined}
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
            onMouseUp={onMouseUp}
            disabled={disabled}
            connectionDirections={connectionDirections}
            connectionColor={connectionColor}
            cellColor={cell.color}
          />
        );
      })}
    </div>
  );
}
