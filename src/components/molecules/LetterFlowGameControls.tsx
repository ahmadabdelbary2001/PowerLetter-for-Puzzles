// src/components/molecules/LetterFlowGameControls.tsx
/**
 * LetterFlowGameControls - A component for game control buttons in the Letter Flow game
 *
 * This component provides buttons for hint, undo, and reset functionality.
 * It's responsive and adjusts its layout based on the device type and screen size.
 */
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shuffle, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Props for the LetterFlowGameControls component
 */
interface LetterFlowGameControlsProps {
  /** Callback function when the hint button is clicked */
  onHint: () => void;
  /** Callback function when the undo button is clicked */
  onUndo: () => void;
  /** Callback function when the reset button is clicked */
  onReset: () => void;
  /** Translation function for button text */
  t: {
    hint: string;
    undo: string;
    reset: string;
  };
  /** Text direction (ltr or rtl) */
  dir: 'ltr' | 'rtl';
  /** Additional CSS classes for custom styling */
  className?: string;
}

/**
 * LetterFlowGameControls component - Provides game control buttons for the Letter Flow game
 *
 * This component renders a responsive row of buttons for hint, undo, and reset functionality.
 * The buttons have appropriate icons and labels, and adjust their layout based on the text direction.
 */
export function LetterFlowGameControls({
  onHint,
  onUndo,
  onReset,
  t,
  dir,
  className
}: LetterFlowGameControlsProps) {
  return (
    <div className={cn("flex justify-center gap-4 mt-6", className)}>
      <Button onClick={onHint} variant="outline">
        <Lightbulb className="w-4 h-4 mr-1" />
        {t.hint}
      </Button>
      <Button onClick={onUndo} variant="outline">
        <ArrowLeft className={`w-4 h-4 ${dir === 'rtl' ? 'ml-1 rotate-0' : 'mr-1 rotate-180'}`} />
        {t.undo}
      </Button>
      <Button onClick={onReset} variant="outline">
        <Shuffle className={`w-4 h-4 ${dir === 'rtl' ? 'ml-1' : 'mr-1'}`} />
        {t.reset}
      </Button>
    </div>
  );
}
