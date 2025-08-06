// src/components/GameScreens/ClueGame/ClueGameScreen.tsx

import React, { useReducer, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { SolutionBoxes } from './SolutionBoxes';
import { LetterGrid } from './LetterGrid';
import GameControls from './GameControls';
import { ArrowLeft, Trophy } from 'lucide-react';
import { useGameMode } from '@/contexts/GameModeContext';
import { loadLevels, generateLetters } from '../../../lib/gameUtils';
import type { Difficulty } from '@/contexts/GameModeContext';
import { reducer } from './gameReducer';
import type { State, Action } from './gameReducer';

interface ClueGameScreenProps {
  onBack: () => void;
}

const ClueGameScreen: React.FC<ClueGameScreenProps> = ({ onBack }) => {
  const { isRTL, language, gameMode, updateScore, currentTeam, teams, nextTurn } = useGameMode();
  const [levels, setLevels] = useState<{ id: string; difficulty: Difficulty; clue: string; solution: string }[]>([]);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [letters, setLetters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // useReducer for all slot/hint/state logic
  const [state, dispatch] = useReducer<React.Reducer<State, Action>>(reducer, {
    slotIndices: [],
    answerSlots: [],
    hintIndices: [],
    gameState: 'playing',
  });

  const currentLevel = levels[currentLevelIndex];
  const solution = currentLevel?.solution.replace(/\s/g, '') ?? '';

  // Load levels
  useEffect(() => {
    loadLevels(language).then(lvls => {
      setLevels(lvls);
      setLoading(false);
    });
  }, [language]);

  // Reset on level change
  useEffect(() => {
    if (!levels.length) return;
    const lvl = levels[currentLevelIndex];
    const sol = lvl.solution.replace(/\s/g, '');
    setLetters(generateLetters(lvl.solution, lvl.difficulty, language));
    dispatch({ type: 'RESET', solutionLen: sol.length });
  }, [levels, currentLevelIndex, language]);

  if (loading) return <p>Loading...</p>;

  // Handlers dispatching actions
  const onLetterClick = (i: number) => dispatch({ type: 'PLACE', gridIndex: i, letter: letters[i] });
  const onRemove     = ()       => dispatch({ type: 'REMOVE_LAST' });
  const onClear      = ()       => dispatch({ type: 'CLEAR' });
  const onHint       = ()       => dispatch({ type: 'HINT', solution, letters });
  const onShow       = ()       => dispatch({ type: 'SHOW', solution, letters });
  const onCheck      = ()       => {
    dispatch({ type: 'CHECK', solution });
    if (state.gameState === 'won' && gameMode === 'competitive') {
      const pts = currentLevel.difficulty === 'easy' ? 10
                : currentLevel.difficulty === 'medium' ? 20 : 30;
      updateScore(teams[currentTeam].id, pts);
      nextTurn();
    }
  };

  const prevLevel = () => currentLevelIndex > 0 && setCurrentLevelIndex(i => i - 1);
  const nextLevel = () => currentLevelIndex < levels.length - 1 && setCurrentLevelIndex(i => i + 1);

  const { slotIndices, answerSlots, hintIndices, gameState } = state;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-5xl">
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> {isRTL ? 'رجوع' : 'Back'}
          </Button>
          <div className="flex items-center gap-4">
            <Badge variant="secondary">{isRTL ? 'المستوى' : 'Level'} {currentLevelIndex + 1}</Badge>
            <Badge variant="outline">{isRTL ? 'الصعوبة' : 'Difficulty'} {currentLevel.difficulty}</Badge>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="space-y-8">
            <div className="text-center">
              <p className="text-xl font-medium">{currentLevel.clue}</p>
            </div>

            <SolutionBoxes solution={solution} currentWord={answerSlots.join('')} />

            <LetterGrid
              letters={letters}
              selectedIndices={slotIndices.filter(i => i !== null) as number[]}
              onLetterClick={onLetterClick}
              disabled={gameState !== 'playing'}
              hintIndices={hintIndices}
            />

            {gameState === 'won' && (
              <div className="text-center">
                <div className="text-green-600 flex items-center justify-center gap-2 mb-4">
                  <Trophy className="h-6 w-6" />
                  <span className="text-lg font-semibold">{isRTL ? 'مبروك!' : 'Congratulations!'}</span>
                </div>
              </div>
            )}

            <GameControls
              onReset={onClear}
              onRemoveLetter={onRemove}
              onClearAnswer={onClear}
              onHint={onHint}
              onCheckAnswer={onCheck}
              onShowSolution={onShow}
              onPrevLevel={prevLevel}
              onNextLevel={nextLevel}
              canRemove={slotIndices.some(i => i !== null && !hintIndices.includes(i))}
              canClear={slotIndices.filter(i => i !== null).length > hintIndices.length}
              canCheck={answerSlots.every(ch => ch !== '')}
              canPrev={currentLevelIndex > 0}
              canNext={currentLevelIndex < levels.length - 1}
              gameState={gameState}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClueGameScreen;
