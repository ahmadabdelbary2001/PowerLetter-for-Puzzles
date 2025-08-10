import React from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

const ModeToggler: React.FC<{ compact?: boolean; className?: string }> = ({ compact = false, className = "" }) => {
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
      {isDark ? (
        <Sun className={`h-3 w-3 sm:h-4 sm:w-4`} />
      ) : (
        <Moon className={`h-3 w-3 sm:h-4 sm:w-4`} />
      )}
    </Button>
  );
};

export default ModeToggler;
