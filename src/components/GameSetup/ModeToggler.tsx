import React from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/useTheme';

const ModeToggler: React.FC = () => {
  const { toggleTheme, isDark } = useTheme();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 w-10 h-10 p-0 rounded-full border-2 transition-all duration-300 hover:scale-110"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-yellow-500 transition-all duration-300" />
      ) : (
        <Moon className="h-4 w-4 text-blue-600 transition-all duration-300" />
      )}
    </Button>
  );
};

export default ModeToggler;
