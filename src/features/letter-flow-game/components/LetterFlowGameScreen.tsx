// src/features/letter-flow-game/components/LetterFlowGameScreen.tsx
/**
 * @description Screen component for the Word Flow game.
 */
import React, { useEffect } from 'react';
import { useLetterFlowGame } from '../hooks/useLetterFlowGame';
import type { WordFlowLevel } from '../engine';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shuffle, Lightbulb } from 'lucide-react';

const LetterFlowGameScreen: React.FC = () => {
  useEffect(() => {
    // Fix for passive event listener issue
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (type, listener, options) {
      if (type === "touchmove" && typeof options === "object" && !options.passive) {
        options = { ...options, passive: false };
      }
      return originalAddEventListener.call(this, type, listener, options);
    };

    return () => {
      // Restore original event listener
      EventTarget.prototype.addEventListener = originalAddEventListener;
    };
  }, []);
  const {
    loading,
    currentLevel,
    board,
    selectedPath,
    foundWords,
    notification,
    activeLetter,
    handleBack,
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
    onHint,
  } = useLetterFlowGame();

  // Calculate the grid size based on the currentLevel if available, otherwise use board
  const gridSize = currentLevel && currentLevel.board.length > 0 
    ? Math.sqrt(currentLevel.board.length) 
    : Math.ceil(Math.sqrt(board.length));

  // Render the game board
  const renderBoard = () => {
    return (
      <div
        className="grid gap-1 mx-auto max-w-md"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
        }}
      >
        {board.map((cell) => {
          const isSelected = selectedPath.some(c => c.x === cell.x && c.y === cell.y);
          const isFound = foundWords.some(path => path.cells.some(c => c.x === cell.x && c.y === cell.y));

          return (
            <div
              key={`${cell.x}-${cell.y}`}
              onMouseDown={() => handleMouseDown(cell)}
              onMouseEnter={() => handleMouseEnter(cell)}
              onMouseUp={handleMouseUp}
              onTouchStart={(e) => {
                e.preventDefault();
                handleMouseDown(cell);
              }}
              onTouchMove={(e) => {
                // Use passive: false for preventDefault to work
                e.preventDefault();
                const touch = e.touches[0];
                const element = document.elementFromPoint(touch.clientX, touch.clientY);
                if (element && element.getAttribute('data-cell-x') && element.getAttribute('data-cell-y')) {
                  const x = parseInt(element.getAttribute('data-cell-x') || '0');
                  const y = parseInt(element.getAttribute('data-cell-y') || '0');
                  const cell = board.find(c => c.x === x && c.y === y);
                  if (cell) handleMouseEnter(cell);
                }
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                handleMouseUp();
              }}
              className={`
                aspect-square flex items-center justify-center rounded-md text-xl font-bold
                cursor-pointer transition-all duration-200
                ${isSelected
                  ? 'bg-blue-500 text-white transform scale-105'
                  : isFound
                    ? 'bg-green-500 text-white'
                    : activeLetter && cell.letter === activeLetter
                      ? 'bg-blue-300 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                }
                ${isFound || (activeLetter && cell.letter === activeLetter) ? 'cursor-default' : ''}
              `}
              data-cell-x={cell.x}
              data-cell-y={cell.y}
            >
              {cell.letter}
            </div>
          );
        })}
      </div>
    );
  };

  // Render found words
  const renderFoundWords = () => {
    if (foundWords.length === 0) return null;

    return (
      <div className="mt-6">
        <div className="text-lg font-semibold mb-2">Connected Letters:</div>
        <div className="flex flex-wrap gap-2">
          {foundWords.map((wordPath, index) => (
            <div
              key={index}
              className="bg-green-100 text-green-800 px-3 py-1 rounded-md"
            >
              {wordPath.word}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render notification
  const renderNotification = () => {
    if (!notification) return null;

    return (
      <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-md shadow-lg z-50 ${
        notification.includes('congrats')
          ? 'bg-green-500 text-white'
          : notification.includes('Already found')
            ? 'bg-yellow-500 text-white'
            : 'bg-red-500 text-white'
      }`}>
        {notification}
      </div>
    );
  };

  // Render the game screen
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-xl">Loading game...</div>
      </div>
    );
  }

  if (!currentLevel) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-xl">No level found.</div>
        <Button onClick={handleBack} className="mt-4">
          Back to Game Selection
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {renderNotification()}

      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button onClick={handleBack} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Word Flow</h1>
          <div className="w-16"></div> {/* Spacer for alignment */}
        </div>

        {/* Game Board */}
        <div className="mb-6">
          {renderBoard()}
        </div>

        {/* Found Words */}
        {renderFoundWords()}

        {/* Game Controls */}
        <div className="flex justify-center gap-4 mt-6">
          <Button onClick={onHint} variant="outline">
            <Lightbulb className="w-4 h-4 mr-1" />
            Hint
          </Button>
          <Button onClick={() => window.location.reload()} variant="outline">
            <Shuffle className="w-4 h-4 mr-1" />
            New Board
          </Button>
        </div>

        {/* Progress */}
        <div className="mt-6 text-center">
          <div className="text-gray-600">
            Connected {foundWords.length} of {Math.floor((currentLevel as WordFlowLevel).endpoints.length / 2)} letter pairs
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${(foundWords.length / Math.floor((currentLevel as WordFlowLevel).endpoints.length / 2)) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LetterFlowGameScreen;