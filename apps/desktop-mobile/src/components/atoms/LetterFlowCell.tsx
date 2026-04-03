// src/components/atoms/LetterFlowCell.tsx (Radical and Corrected Version)
import React from "react";
import { cn } from "@/lib/utils";

interface LetterFlowCellProps {
  letter: string;
  x: number;
  y: number;
  isSelected?: boolean;
  isFound?: boolean;
  isActive?: boolean;
  onMouseDown?: (cell: { x: number; y: number; letter: string }) => void;
  onMouseEnter?: (cell: { x: number; y: number; letter: string }) => void;
  onMouseUp?: () => void;
  disabled?: boolean;
  className?: string;
  connectionDirections?: string[];
  connectionColor?: string | undefined;
  cellColor?: string | undefined;
}

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
  className,
  connectionDirections = [],
  connectionColor,
  cellColor,
}: LetterFlowCellProps) {
  const cellData = { x, y, letter };

  // --- POINTER EVENT HANDLERS (for both mouse and touch) ---

  const handlePointerDown: React.PointerEventHandler = (e) => {
    if (disabled || !onMouseDown) return;
    // Capture the pointer to prevent scrolling and other default actions.
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    onMouseDown(cellData);
  };

  const handlePointerMove: React.PointerEventHandler = (e) => {
    // Only trigger if a pointer is being dragged.
    if (e.buttons !== 1 || disabled || !onMouseEnter) return;
    
    // Find the cell element under the current pointer position.
    const element = document.elementFromPoint(e.clientX, e.clientY);
    const cellEl = element?.closest<HTMLElement>("[data-cell-x]");

    if (cellEl) {
      const cx = parseInt(cellEl.dataset.cellX || "0", 10);
      const cy = parseInt(cellEl.dataset.cellY || "0", 10);
      // Find the letter from the inner span to avoid grabbing pipe elements.
      const letterSpan = cellEl.querySelector<HTMLSpanElement>('.cell-letter');
      onMouseEnter({ x: cx, y: cy, letter: letterSpan?.textContent?.trim() || "" });
    }
  };

  const handlePointerUp: React.PointerEventHandler = (e) => {
    if (disabled || !onMouseUp) return;
    // Release the pointer capture.
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    onMouseUp();
  };

  // Unchanged: Keyboard handler for accessibility
  const onKeyDown: React.KeyboardEventHandler = (e) => {
    if (disabled || !onMouseDown) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onMouseDown(cellData);
    }
  };

  // --- STYLE AND COLOR LOGIC (from the old file) ---
  const circleSizePercent = 56;
  const dotColor = connectionColor ?? cellColor ?? undefined;

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-pressed={isSelected || undefined}
      data-cell-x={x}
      data-cell-y={y}
      // Attach the unified Pointer Event handlers.
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp} // Handle cancelled gestures
      onKeyDown={onKeyDown}
      // --- CRITICAL FIX: Add `touch-none` to disable default browser touch actions ---
      className={cn(
        "aspect-square flex items-center justify-center rounded-md text-xl font-bold select-none relative transition-all duration-150 touch-none",
        {
          "bg-gray-50 dark:bg-gray-800": !isSelected && !isFound && !isActive,
          "cursor-pointer": !disabled,
          "cursor-not-allowed opacity-70": disabled,
          "text-gray-900 dark:text-gray-100": !isSelected && !isFound && !isActive && !dotColor,
        },
        className
      )}
    >
      {/* --- JSX STRUCTURE (from the old file to preserve style) --- */}

      {/* Connection pipes (drawn behind the center dot) */}
      {connectionDirections.includes('top') && (
        <div
          aria-hidden
          className="absolute top-0 left-1/2 transform -translate-x-1/2"
          style={{
            width: `${Math.max(6, circleSizePercent * 0.1)}%`,
            height: `50%`,
            background: connectionColor,
            zIndex: 0,
          }}
        />
      )}
      {connectionDirections.includes('bottom') && (
        <div
          aria-hidden
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
          style={{
            width: `${Math.max(6, circleSizePercent * 0.1)}%`,
            height: `50%`,
            background: connectionColor,
            zIndex: 0,
          }}
        />
      )}
      {connectionDirections.includes('left') && (
        <div
          aria-hidden
          className="absolute left-0 top-1/2 transform -translate-y-1/2"
          style={{
            height: `${Math.max(6, circleSizePercent * 0.1)}%`,
            width: `50%`,
            background: connectionColor,
            zIndex: 0,
          }}
        />
      )}
      {connectionDirections.includes('right') && (
        <div
          aria-hidden
          className="absolute right-0 top-1/2 transform -translate-y-1/2"
          style={{
            height: `${Math.max(6, circleSizePercent * 0.1)}%`,
            width: `50%`,
            background: connectionColor,
            zIndex: 0,
          }}
        />
      )}

      {/* Center dot (letter) on top of pipes */}
      <div
        className="flex items-center justify-center rounded-full z-10 pointer-events-none"
        style={{
          width: `${circleSizePercent}%`,
          height: `${circleSizePercent}%`,
          background: dotColor ?? '#ffffff',
          boxShadow: dotColor ? '0 2px 8px rgba(0,0,0,0.12)' : undefined,
          border: dotColor ? 'none' : '1px solid rgba(0,0,0,0.06)',
        }}
      >
        {letter ? (
          <span
            className="text-sm font-bold cell-letter"
            style={{ color: dotColor ? '#fff' : '#111' }}
          >
            {letter}
          </span>
        ) : null}
      </div>
    </div>
  );
}
