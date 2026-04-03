// src/components/atoms/GridCell.tsx
/**
 * @description A single cell component for the crossword grid.
 * This component represents a single cell in the crossword grid and handles its display state.
 */
import React from 'react';
import { cn } from '@/lib/utils';

interface GridCellProps {
  letter?: string;
  isRevealed?: boolean;
  isEmpty?: boolean;
  size?: number;
  className?: string;
}

/**
 * Renders a single, responsive cell for a crossword-style grid.
 */
export const GridCellComponent: React.FC<GridCellProps> = ({
  letter = '',
  isRevealed = false,
  isEmpty = false,
  size = 40,
  className
}) => {
  if (isEmpty) {
    return (
      <div
        className={cn("rounded-md border-2 border-transparent bg-transparent", className)}
        style={{ width: `${size}px`, height: `${size}px` }}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-md flex items-center justify-center font-bold border-2 flex-shrink-0 transition-all duration-300",
        isRevealed
          ? "bg-primary/90 border-primary text-primary-foreground animate-in fade-in zoom-in-50"
          : "bg-card border-border",
        className
      )}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${size * 0.5}px`,
      }}
    >
      {isRevealed ? letter : ''}
    </div>
  );
};

export default GridCellComponent;
