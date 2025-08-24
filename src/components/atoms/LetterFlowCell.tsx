// src/components/atoms/LetterFlowCell.tsx
/**
 * LetterFlowCell - A component for displaying individual cells in the Letter Flow game board
 *
 * This component renders a single cell in the Letter Flow game grid that can be interactive.
 * It supports different visual states for selection, found paths, and active letters.
 * The component handles both mouse and touch events for interaction.
 */
import { cn } from "@/lib/utils"

/**
 * Props for the LetterFlowCell component
 */
interface LetterFlowCellProps {
  /** The letter to display in the cell */
  letter: string
  /** X coordinate of the cell in the grid */
  x: number
  /** Y coordinate of the cell in the grid */
  y: number
  /** Whether this cell is currently selected in a path */
  isSelected?: boolean
  /** Whether this cell is part of a found word */
  isFound?: boolean
  /** Whether this cell has the currently active letter */
  isActive?: boolean
  /** Callback function when the cell is clicked */
  onMouseDown?: (cell: {x: number, y: number, letter: string}) => void
  /** Callback function when the mouse enters the cell */
  onMouseEnter?: (cell: {x: number, y: number, letter: string}) => void
  /** Callback function when the mouse is released */
  onMouseUp?: () => void
  /** Whether the cell is disabled (non-interactive) */
  disabled?: boolean
  /** Additional CSS classes for custom styling */
  className?: string
}

/**
 * LetterFlowCell component - Displays a single cell in the Letter Flow game grid
 *
 * This component is used in the Letter Flow game to display individual cells that players
 * can interact with to form paths. It has different visual states for selected cells,
 * found cells, and active cells. The component handles both mouse and touch events.
 */
export function LetterFlowCell({
  letter,
  x,
  y,
  isSelected = false,
  isFound = false,
  isActive = false,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  disabled = false,
  className
}: LetterFlowCellProps) {
  return (
    <div
      key={`${x}-${y}`}
      onMouseDown={onMouseDown ? () => onMouseDown({x, y, letter}) : undefined}
      onMouseEnter={onMouseEnter ? () => onMouseEnter({x, y, letter}) : undefined}
      onMouseUp={onMouseUp}
      onTouchStart={(e) => {
        e.preventDefault();
        onMouseDown?.({x, y, letter});
      }}
      onTouchMove={(e) => {
        // Use passive: false for preventDefault to work
        e.preventDefault();
        const touch = e.touches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        if (element && element.getAttribute('data-cell-x') && element.getAttribute('data-cell-y')) {
          const x = parseInt(element.getAttribute('data-cell-x') || '0');
          const y = parseInt(element.getAttribute('data-cell-y') || '0');
          // We don't have access to the full board here, so just pass the letter
          onMouseEnter?.({x, y, letter});
        }
      }}
      onTouchEnd={(e) => {
        e.preventDefault();
        onMouseUp?.();
      }}
      className={cn(
        "aspect-square flex items-center justify-center rounded-md text-xl font-bold cursor-pointer transition-all duration-200",
        {
          "bg-blue-500 text-white transform scale-105": isSelected,
          "bg-green-500 text-white": isFound,
          "bg-blue-300 text-white": isActive && !isSelected && !isFound,
          "bg-gray-100 hover:bg-gray-200": !isSelected && !isFound && !isActive,
          "cursor-default": isFound || (isActive && !isSelected),
        },
        disabled && "opacity-70 cursor-not-allowed",
        className
      )}
      data-cell-x={x}
      data-cell-y={y}
    >
      {letter}
    </div>
  );
}
