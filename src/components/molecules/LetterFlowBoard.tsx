// src/components/molecules/LetterFlowBoard.tsx
/**
 * LetterFlowBoard - A responsive grid for the Letter Flow game
 *
 * This component displays a grid of cells that players can interact with to form paths.
 * It handles both mouse and touch events for interaction and supports different visual states.
 */
import { LetterFlowCell } from "@/components/atoms/LetterFlowCell"
import { cn } from "@/lib/utils"

/**
 * Props for the LetterFlowBoard component
 */
interface LetterFlowBoardProps {
  /** Array of cells to display in the grid */
  cells: Array<{
    x: number;
    y: number;
    letter: string;
    isUsed?: boolean;
  }>;
  /** Array of cells currently selected in a path */
  selectedPath: Array<{x: number, y: number, letter: string}>;
  /** Array of found words with their cells */
  foundWords: Array<{
    word: string;
    cells: Array<{x: number, y: number, letter: string}>;
  }>;
  /** The currently active letter */
  activeLetter: string | null;
  /** Callback function when a cell is clicked */
  onMouseDown: (cell: {x: number, y: number, letter: string}) => void;
  /** Callback function when the mouse enters a cell */
  onMouseEnter: (cell: {x: number, y: number, letter: string}) => void;
  /** Callback function when the mouse is released */
  onMouseUp: () => void;
  /** Additional CSS classes for custom styling */
  className?: string;
}

/**
 * LetterFlowBoard component - A responsive grid for the Letter Flow game
 *
 * This component renders a grid of LetterFlowCell components. It automatically
 * adjusts the grid layout based on the number of cells. The component supports
 * highlighting selected cells, found cells, and active cells, and handles
 * both mouse and touch events for interaction.
 */
export function LetterFlowBoard({
  cells,
  selectedPath,
  foundWords,
  activeLetter,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  className
}: LetterFlowBoardProps) {
  // Calculate the grid size based on the cells
  const gridSize = Math.ceil(Math.sqrt(cells.length));

  // Check if a cell is selected
  const isSelected = (cell: {x: number, y: number}) => 
    selectedPath.some(c => c.x === cell.x && c.y === cell.y);

  // Check if a cell is part of a found word
  const isFound = (cell: {x: number, y: number}) => 
    foundWords.some(path => path.cells.some(c => c.x === cell.x && c.y === cell.y));

  return (
    <div
      className={cn("grid gap-1 mx-auto max-w-md", className)}
      style={{
        gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
      }}
    >
      {cells.map((cell) => (
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
          disabled={isFound(cell) || (activeLetter && cell.letter === activeLetter) ? true : undefined}
        />
      ))}
    </div>
  );
}
