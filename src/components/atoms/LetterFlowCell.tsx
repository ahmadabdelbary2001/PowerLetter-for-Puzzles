// src/components/atoms/LetterFlowCell.tsx
import React, { useRef } from "react";
import { cn } from "@/lib/utils";

interface LetterFlowCellProps {
  letter: string;
  x: number;
  y: number;
  isSelected?: boolean;
  isFound?: boolean;
  isActive?: boolean;
  onMouseDown?: (cell: {x: number, y: number, letter: string}) => void;
  onMouseEnter?: (cell: {x: number, y: number, letter: string}) => void;
  onMouseUp?: () => void;
  disabled?: boolean;
  className?: string;
  // visual props
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
  cellColor
}: LetterFlowCellProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  const handlePointerDown: React.PointerEventHandler = (e) => {
    if (disabled) return;
    (e.target as Element)?.setPointerCapture?.(e.pointerId);
    onMouseDown?.({ x, y, letter });
    e.preventDefault();
  };

  const handlePointerMove: React.PointerEventHandler = (e) => {
    if (disabled) return;
    const el = document.elementFromPoint(e.clientX, e.clientY) as Element | null;
    const cellEl = el?.closest?.("[data-cell-x]") as Element | null;
    if (cellEl) {
      const cx = parseInt(cellEl.getAttribute("data-cell-x") || "0", 10);
      const cy = parseInt(cellEl.getAttribute("data-cell-y") || "0", 10);
      onMouseEnter?.({ x: cx, y: cy, letter: cellEl.textContent?.trim() || "" });
    }
  };

  const handlePointerUp: React.PointerEventHandler = (e) => {
    try {
      (e.target as Element)?.releasePointerCapture?.(e.pointerId);
    } catch (err) {
      console.debug('releasePointerCapture failed', err);
    }
    onMouseUp?.();
  };

  // Touch event handlers for mobile devices
  const handleTouchStart: React.TouchEventHandler = (e) => {
    if (disabled) return;
    e.preventDefault();

    // Get the first touch
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);

    if (element && element.getAttribute('data-cell-x') && element.getAttribute('data-cell-y')) {
      const x = parseInt(element.getAttribute('data-cell-x') || '0');
      const y = parseInt(element.getAttribute('data-cell-y') || '0');
      const letter = element.textContent?.trim() || '';
      onMouseDown?.({ x, y, letter });
    }
  };

  const handleTouchMove: React.TouchEventHandler = (e) => {
    if (disabled) return;
    e.preventDefault();

    // Get the first touch
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);

    if (element && element.getAttribute('data-cell-x') && element.getAttribute('data-cell-y')) {
      const x = parseInt(element.getAttribute('data-cell-x') || '0');
      const y = parseInt(element.getAttribute('data-cell-y') || '0');
      const letter = element.textContent?.trim() || '';
      onMouseEnter?.({ x, y, letter });
    }
  };

  const handleTouchEnd: React.TouchEventHandler = (e) => {
    if (disabled) return;
    e.preventDefault();
    onMouseUp?.();
  };

  const onKeyDown: React.KeyboardEventHandler = (e) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onMouseDown?.({ x, y, letter });
    }
  };

  // render the center circle (letter) and connection pipes behind it
  const circleSizePercent = 56;

  // Use connectionColor first, then fallback to cellColor, then neutral
  const dotColor = connectionColor ?? cellColor ?? undefined;

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-pressed={isSelected || undefined}
      data-cell-x={x}
      data-cell-y={y}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onKeyDown={onKeyDown}
      className={cn(
        "aspect-square flex items-center justify-center rounded-md text-xl font-bold select-none relative transition-all duration-150",
        {
          "bg-gray-50 dark:bg-gray-800": !isSelected && !isFound && !isActive,
          "cursor-not-allowed opacity-70": disabled,
          "text-gray-900 dark:text-gray-100": !isSelected && !isFound && !isActive && !dotColor,
        },
        className
      )}
    >
      {/* connection pipes (drawn behind the center dot) */}
      {connectionDirections.includes('top') && (
        <div
          aria-hidden
          className="absolute top-0 left-1/2 transform -translate-x-1/2"
          style={{
            width: `${Math.max(6, circleSizePercent * 0.08)}%`,
            height: `40%`,
            background: connectionColor,
            borderRadius: 4,
            zIndex: 0
          }}
        />
      )}
      {connectionDirections.includes('bottom') && (
        <div
          aria-hidden
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
          style={{
            width: `${Math.max(6, circleSizePercent * 0.08)}%`,
            height: `40%`,
            background: connectionColor,
            borderRadius: 4,
            zIndex: 0
          }}
        />
      )}
      {connectionDirections.includes('left') && (
        <div
          aria-hidden
          className="absolute left-0 top-1/2 transform -translate-y-1/2"
          style={{
            height: `${Math.max(6, circleSizePercent * 0.08)}%`,
            width: `40%`,
            background: connectionColor,
            borderRadius: 4,
            zIndex: 0
          }}
        />
      )}
      {connectionDirections.includes('right') && (
        <div
          aria-hidden
          className="absolute right-0 top-1/2 transform -translate-y-1/2"
          style={{
            height: `${Math.max(6, circleSizePercent * 0.08)}%`,
            width: `40%`,
            background: connectionColor,
            borderRadius: 4,
            zIndex: 0
          }}
        />
      )}

      {/* center dot (letter) on top of pipes */}
      <div
        className="flex items-center justify-center rounded-full z-10"
        style={{
          width: `${circleSizePercent}%`,
          height: `${circleSizePercent}%`,
          background: dotColor ?? '#ffffff',
          boxShadow: dotColor ? '0 2px 8px rgba(0,0,0,0.12)' : undefined,
          border: dotColor ? 'none' : '1px solid rgba(0,0,0,0.06)'
        }}
      >
        {letter ? (
          <span
            className="text-sm font-bold"
            style={{ color: dotColor ? '#fff' : (isSelected || isFound || isActive ? '#fff' : '#111') }}
          >
            {letter}
          </span>
        ) : null}
      </div>
    </div>
  );
}
