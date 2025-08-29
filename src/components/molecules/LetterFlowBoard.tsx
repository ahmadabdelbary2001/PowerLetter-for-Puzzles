// src/components/molecules/LetterFlowBoard.tsx
/**
 * LetterFlowBoard component - Renders the game board for the Letter Flow game
 * 
 * This component is responsible for:
 * 1. Creating a grid layout for the game cells
 * 2. Managing the visual state of each cell (selected, found, active)
 * 3. Determining connection directions between cells
 * 4. Applying appropriate colors and styling based on game state
 * 
 * The board receives cells as props and maps them to LetterFlowCell components,
 * handling all the game logic for displaying connections and interactions.
 */
import { LetterFlowCell } from "@/components/atoms/LetterFlowCell";
import { cn } from "@/lib/utils";
import type { BoardCell } from "@/features/letter-flow-game/engine";

interface LetterFlowBoardProps {
  cells: BoardCell[];
  selectedPath: Array<{x: number, y: number, letter: string, color?: string}>;
  foundWords: Array<{
    word: string;
    cells: Array<{x: number, y: number, letter: string, color?: string}>;
  }>;
  activeLetter: string | null;
  onMouseDown: (cell: {x: number, y: number, letter: string}) => void;
  onMouseEnter: (cell: {x: number, y: number, letter: string}) => void;
  onMouseUp: () => void;
  className?: string;
  dir?: 'ltr' | 'rtl';
}

const COLORS = [
  '#FF5733', '#33FF57', '#3357FF', '#F333FF', '#FF33A1',
  '#A133FF', '#33FFF0', '#FFD733', '#33FF96', '#FF9633'
];

function colorForLetter(letter: string | undefined | null) {
  if (!letter) return undefined;
  const code = letter.toUpperCase().charCodeAt(0) || 0;
  const idx = (code - 65) % COLORS.length;
  return COLORS[(idx + COLORS.length) % COLORS.length];
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

  const selectedMap = new Map<string, {x:number,y:number,letter:string,color?:string}>();
  selectedPath.forEach(c => selectedMap.set(cellKey(c), c));

  const foundMap = new Map<string, { word: string; cells: Array<{x:number,y:number,letter:string,color?:string}> }>();
  foundWords.forEach(path => path.cells.forEach(c => foundMap.set(cellKey(c), { word: path.word, cells: path.cells })));

  // calculate connection directions for a cell (top/right/bottom/left)
  const getConnectionDirections = (cell: {x:number,y:number}) => {
    const directions: string[] = [];
    const allPaths = [...foundWords.map(w => w.cells), selectedPath];

    for (const path of allPaths) {
      const index = path.findIndex(c => c.x === cell.x && c.y === cell.y);
      if (index !== -1) {
        if (index > 0) {
          const prev = path[index - 1];
          if (prev.x === cell.x - 1 && prev.y === cell.y) directions.push('left');
          if (prev.x === cell.x + 1 && prev.y === cell.y) directions.push('right');
          if (prev.x === cell.x && prev.y === cell.y - 1) directions.push('top');
          if (prev.x === cell.x && prev.y === cell.y + 1) directions.push('bottom');
        }
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

  const getConnectionColor = (cell: {x:number,y:number}) => {
    for (const wordPath of foundWords) {
      if (wordPath.cells.some(c => c.x === cell.x && c.y === cell.y)) {
        // color stored on first cell of the path (endpoint) or on that cell
        return wordPath.cells[0].color || wordPath.cells.find(c => c.color)?.color || colorForLetter(wordPath.word);
      }
    }
    if (selectedPath.some(c => c.x === cell.x && c.y === cell.y)) {
      // use color from the selected path endpoints if available
      return selectedPath[0].color || colorForLetter(selectedPath[0].letter);
    }
    return undefined;
  };

  const isSelected = (cell: {x:number,y:number}) => selectedMap.has(cellKey(cell));
  const isFound = (cell: {x:number,y:number}) => foundMap.has(cellKey(cell));

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
