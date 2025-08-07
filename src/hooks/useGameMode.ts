import { useContext } from 'react';
import { GameModeContext } from '../contexts/GameModeContext';
import type { GameModeContextType } from '../types/game';

export const useGameMode = (): GameModeContextType => {
    const ctx = useContext(GameModeContext);
    if (!ctx) throw new Error('useGameMode must be used within GameModeProvider');
    return ctx;
};