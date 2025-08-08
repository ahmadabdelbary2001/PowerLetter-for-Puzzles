// src/hooks/useGameMode.ts
import { useContext } from 'react';
import { GameModeContext } from '@/contexts/GameModeContext';
import type { GameModeContextType } from '@/types/game';

export const useGameMode = (): GameModeContextType => {
    const context = useContext(GameModeContext);
    if (!context) throw new Error('useGameMode must be used within GameModeProvider');
    return context;
};
