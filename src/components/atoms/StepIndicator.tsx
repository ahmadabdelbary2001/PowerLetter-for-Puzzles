// src/components/atoms/StepIndicator.tsx
import React from 'react';
import { cn } from '@/lib/utils';

type StepIndicatorVariant = 'blue' | 'green';

const colorVariants: Record<StepIndicatorVariant, string> = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
};

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  variant?: StepIndicatorVariant;
}

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
