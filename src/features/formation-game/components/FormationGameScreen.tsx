// src/features/formation-game/components/FormationGameScreen.tsx
/**
 * @description The main UI component for the Word Formation Challenge.
 * It renders the crossword grid, the letter input area, and game controls.
 */
import React from 'react';
import { Button } from '@/components/ui/button';
import { GameLayout } from '@/components/templates/GameLayout';
import { useFormationGame } from '../hooks/useFormationGame';
import { useTranslation } from '@/hooks/useTranslation';
import { RotateCcw, Check, RefreshCw, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GridCell } from '../engine';

/**
 * FIX: A completely rewritten CrosswordGrid component.
 * This component now builds a full grid matrix (rows and columns) and fills it,
 * ensuring that empty spaces are rendered correctly to form a proper crossword layout.
 */
const CrosswordGrid = ({ grid, revealedCells }: { grid: GridCell[], revealedCells: Set<string> }) => {
  if (!grid || grid.length === 0) return null;

  // Determine the dimensions of the grid
  const max_x = Math.max(0, ...grid.map(c => c.x));
  const max_y = Math.max(0, ...grid.map(c => c.y));

  // Create a 2D array to represent the grid matrix
  const gridMatrix: (GridCell | null)[][] = Array.from({ length: max_y + 1 }, () =>
    Array(max_x + 1).fill(null)
  );

  // Populate the matrix with the cell data from the level
  grid.forEach(cell => {
    if (gridMatrix[cell.y] && gridMatrix[cell.y][cell.x] !== undefined) {
      gridMatrix[cell.y][cell.x] = cell;
    }
  });

  return (
    <div className="flex flex-col gap-1">
      {gridMatrix.map((row, y) => (
        <div key={y} className="flex gap-1">
          {row.map((cell, x) => {
            const isRevealed = revealedCells.has(`${x},${y}`);
            return (
              <div
                key={`${x}-${y}`}
                className={cn(
                  "w-full aspect-square rounded-md flex items-center justify-center font-bold text-lg sm:text-xl border-2",
                  // If a cell is null, it's an empty (black) space
                  !cell ? "bg-transparent border-transparent" :
                  // If the cell is revealed, show primary color
                  isRevealed ? "bg-primary/90 border-primary text-primary-foreground animate-in fade-in zoom-in-50 duration-500" :
                  // Otherwise, it's a hidden, playable cell
                  "bg-card border-border"
                )}
              >
                {cell && isRevealed ? cell.letter : ''}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};


const FormationGameScreen: React.FC = () => {
  const { t } = useTranslation();
  const {
    loading,
    currentLevel,
    currentLevelIndex,
    letters,
    currentInput,
    revealedCells,
    notification,
    usedLetterIndices,
    handleBack,
    onLetterSelect,
    onRemoveLast,
    onShuffle,
    onCheckWord,
    onHint,
  } = useFormationGame();

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><p>{t.loading}...</p></div>;
  }

  if (!currentLevel || currentLevel.baseLetters === 'ERROR') {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4 p-4 text-center">
        <p className="text-xl font-semibold">{t.noLevelsFound}</p>
        <Button onClick={handleBack}>{t.back}</Button>
      </div>
    );
  }

  return (
    <GameLayout
      title={t.formationTitle}
      levelIndex={currentLevelIndex}
      onBack={handleBack}
      difficulty={currentLevel.difficulty}
    >
      <div className="flex flex-col items-center gap-6">
        <div className="w-full max-w-md">
          <CrosswordGrid grid={currentLevel.grid} revealedCells={revealedCells} />
        </div>

        <div className="h-8 text-center font-semibold text-primary">
          {notification}
        </div>

        <div className="h-12 w-full max-w-xs bg-muted rounded-lg flex items-center justify-center text-2xl font-bold tracking-widest">
          {currentInput || <span className="text-muted-foreground/50">{t.typeAWord || "Type a word"}</span>}
        </div>

        <div className="relative w-48 h-48 sm:w-56 sm:h-56">
          {letters.map((letter, i) => {
            const angle = (i / letters.length) * 2 * Math.PI;
            const radius = letters.length > 6 ? 80 : 70;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const isUsed = usedLetterIndices.has(i);

            // Count how many times this letter appears in the base letters
            const letterCount = letters.filter(l => l === letter).length;
            // Count how many times this letter has been used
            const usedCount = Array.from(usedLetterIndices).filter(idx => letters[idx] === letter).length;

            // Letter is disabled if it's already used and there are no more duplicates available
            const isDisabled = isUsed && usedCount >= letterCount;

            return (
              <Button
                key={`${letter}-${i}`}
                onClick={() => !isDisabled && onLetterSelect(letter, i)}
                className={`absolute w-12 h-12 sm:w-14 sm:h-14 rounded-full text-xl font-bold transition-all ${
                  isDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105'
                }`}
                style={{
                  top: `calc(50% - 28px + ${y}px)`,
                  left: `calc(50% - 28px + ${x}px)`,
                }}
                disabled={isDisabled}
              >
                {letter}
              </Button>
            );
          })}
          <Button
            size="icon"
            variant="ghost"
            onClick={onShuffle}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full"
          >
            <RefreshCw className="w-8 h-8 text-muted-foreground" />
          </Button>
        </div>

        <div className="flex gap-4">
          <Button variant="outline" onClick={onRemoveLast} disabled={currentInput.length === 0}>
            <RotateCcw className="w-5 h-5 mr-2" /> {t.remove}
          </Button>
          <Button variant="outline" onClick={onHint} disabled={revealedCells.size >= (currentLevel?.grid.length || 0)}>
            <Lightbulb className="w-5 h-5 mr-2" /> {t.hint}
          </Button>
          <Button onClick={onCheckWord} disabled={currentInput.length < 2} className="bg-green-600 hover:bg-green-700">
            <Check className="w-5 h-5 mr-2" /> {t.check}
          </Button>
        </div>
      </div>
    </GameLayout>
  );
};

export default FormationGameScreen;
