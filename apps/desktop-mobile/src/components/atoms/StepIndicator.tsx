// src/components/atoms/StepIndicator.tsx
/**
 * StepIndicator - A visual indicator of progress through steps
 * 
 * This component displays a series of dots that represent steps in a process.
 * The current step is highlighted and wider than the others. It's commonly used
 * in multi-step forms or games to show progress.
 */
import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Supported color variants for the step indicator
 */
type StepIndicatorVariant = 'blue' | 'green';

/**
 * CSS classes for each color variant
 */
const colorVariants: Record<StepIndicatorVariant, string> = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
};

/**
 * Props for the StepIndicator component
 */
interface StepIndicatorProps {
  /** The current step number (1-indexed) */
  currentStep: number;
  /** The total number of steps */
  totalSteps: number;
  /** The color variant to use for highlighting the current step */
  variant?: StepIndicatorVariant;
}

/**
 * StepIndicator component - Visual progress indicator
 * 
 * This component displays a horizontal series of dots representing steps in a process.
 * The current step is highlighted with a specific color and is wider than the other steps.
 * It's commonly used in multi-step forms, onboarding flows, or games to show progress.
 * The component is responsive and works in both light and dark modes.
 */
export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  variant = 'blue'
}) => (
  <div className="flex justify-center gap-2 mb-8">
    {Array.from({ length: totalSteps }).map((_, i) => (
      <div
        key={i}
        className={cn(
          'h-2 rounded-full transition-all duration-300',
          i + 1 === currentStep ? `w-8 ${colorVariants[variant]}` : 'w-4 bg-gray-300 dark:bg-gray-600'
        )}
      />
    ))}
  </div>
);