// src/components/molecules/ModeToggler.tsx
/**
 * ModeToggler - A button component for toggling between light and dark themes
 * 
 * This component provides a button that allows users to switch between
 * light and dark themes. It supports both compact and full display modes,
 * and is accessible with proper ARIA attributes.
 */
import React from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

/**
 * Props for the ModeToggler component
 */
interface ModeTogglerProps {
  /** Whether to display in compact mode (smaller button) */
  compact?: boolean;
  /** Additional CSS classes for custom styling */
  className?: string;
}

/**
 * ModeToggler component - A button for toggling between light and dark themes
 * 
 * This component renders a circular button that toggles between light and dark
 * themes. It displays a sun icon in dark mode and a moon icon in light mode.
 * The component is accessible, with proper ARIA attributes for screen readers.
 */
const ModeToggler: React.FC<ModeTogglerProps> = ({ compact = false, className = "" }) => {
  const { toggleTheme, isDark } = useTheme();

  // compact true -> slightly smaller (used inside mobile panels)
  const baseSize = compact ? "w-8 h-8" : "w-8 h-8 sm:w-10 sm:h-10";

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className={`${baseSize} p-0 rounded-full border-2 transition-transform duration-200 flex items-center justify-center ${className}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
    >
      {/* Display sun icon in dark mode, moon icon in light mode */}
      {isDark ? (
        <Sun className={`h-3 w-3 sm:h-4 sm:w-4`} />
      ) : (
        <Moon className={`h-3 w-3 sm:h-4 sm:w-4`} />
      )}
    </Button>
  );
};

export default ModeToggler;