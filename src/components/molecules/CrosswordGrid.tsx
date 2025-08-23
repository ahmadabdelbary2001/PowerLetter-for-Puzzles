// src/components/molecules/CrosswordGrid.tsx
/**
 * @description A responsive crossword grid component.
 * This component renders a crossword grid with cells that can be revealed.
 */
import React, { useState, useEffect } from 'react';
import GridCellComponent from '@/components/atoms/GridCell';
import type { GridCell as GridCellType } from '@/features/formation-game/engine';
import { cn } from '@/lib/utils';

interface CrosswordGridProps {
  grid: GridCellType[];
  revealedCells: Set<string>;
  className?: string;
}

/**
 * Renders a full crossword grid that adapts its cell size to the screen width.
 */
export const CrosswordGrid: React.FC<CrosswordGridProps> = ({
  grid,
  revealedCells,
  className
}) => {
  const [cellSize, setCellSize] = useState(40);

  useEffect(() => {
    const updateCellSize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 380) setCellSize(30);
      else if (screenWidth < 640) setCellSize(35);
      else if (screenWidth < 768) setCellSize(40);
      else setCellSize(45);
    };
    updateCellSize();
    window.addEventListener('resize', updateCellSize);
    return () => window.removeEventListener('resize', updateCellSize);
  }, []);

  if (!grid || grid.length === 0) return null;

  const max_x = Math.max(0, ...grid.map(c => c.x));
  const max_y = Math.max(0, ...grid.map(c => c.y));
  const gridMatrix: (GridCellType | null)[][] = Array.from({ length: max_y + 1 }, () =>
    Array(max_x + 1).fill(null)
  );
  grid.forEach(cell => {
    if (gridMatrix[cell.y]) gridMatrix[cell.y][cell.x] = cell;
  });

  return (
    <div className={cn("flex flex-col gap-1 w-full overflow-x-auto py-2", className)}>
      {gridMatrix.map((row, y) => (
        <div key={y} className="flex gap-1 justify-center">
          {row.map((cell, x) => (
            <GridCellComponent
              key={`${x}-${y}`}
              letter={cell?.letter}
              isRevealed={revealedCells.has(`${x},${y}`)}
              isEmpty={!cell}
              size={cellSize}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default CrosswordGrid;
