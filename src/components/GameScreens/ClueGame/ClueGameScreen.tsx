/* src/components/GameScreens/ClueGame/ClueGameScreen.tsx */
import React, { useReducer, useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SolutionBoxes } from './SolutionBoxes';
import { LetterGrid } from './LetterGrid';
import GameControls from './GameControls';
import { ArrowLeft, ArrowRight, Trophy } from 'lucide-react';
import { useGameMode } from '@/hooks/useGameMode';
import { loadLevels, generateLetters } from '../../../lib/gameUtils';
import type { Difficulty } from '@/types/game';
import { reducer } from './gameReducer';
import type { State, Action } from './gameReducer';
import { useTranslation } from '@/hooks/useTranslation';

interface ClueGameScreenProps {
  onBack: () => void;
}

const ClueGameScreen: React.FC<ClueGameScreenProps> = ({ onBack }) => {
  const { language, gameMode, updateScore, currentTeam, teams, nextTurn } = useGameMode();
  const { t, dir } = useTranslation();
  const [levels, setLevels] = useState<{ id: string; difficulty: Difficulty; clue: string; solution: string }[]>([]);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [letters, setLetters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{message: string, type: 'error' | 'success'} | null>(null);
  const [wrongAnswers, setWrongAnswers] = useState<string[]>([]);

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
    setWrongAnswers([]);
    setNotification(null);
  }, [levels, currentLevelIndex, language]);

  // Handle game state changes
  useEffect(() => {
    if (state.gameState === 'failed') {
      const currentAnswer = state.answerSlots.join('');
      
      // Add to wrong answers if not already listed
      if (!wrongAnswers.includes(currentAnswer)) {
        setWrongAnswers(prev => [...prev, currentAnswer]);
      }
      
      // Show error notification
      setNotification({ message: t.wrongAnswer, type: 'error' });
      
      // Reset game after delay
      const timer = setTimeout(() => {
        dispatch({ type: 'CLEAR' });
        nextTurn('lose');
        setNotification(null);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [state.gameState, t.wrongAnswer, nextTurn]);

  if (loading) return <p>Loading...</p>;

  // Handlers for letter grid & controls
  const onLetterClick = (i: number) =>
    dispatch({ type: 'PLACE', gridIndex: i, letter: letters[i] });
  const onRemove = () => dispatch({ type: 'REMOVE_LAST' });
  const onClear = () => dispatch({ type: 'CLEAR' });
  const onHint = () => dispatch({ type: 'HINT', solution, letters });
  const onShow = () => dispatch({ type: 'SHOW', solution, letters });
  const onCheck = () => {
    dispatch({ type: 'CHECK', solution });

    if (state.gameState === 'won' && gameMode === 'competitive') {
      // Award points
      const pts =
        currentLevel.difficulty === 'easy'
          ? 10
          : currentLevel.difficulty === 'medium'
          ? 20
          : 30;
      updateScore(teams[currentTeam].id, pts);
      nextTurn('win');
      setNotification({
        message: `+${pts} ${t.congrats}`,
        type: 'success',
      });
    }
  };

  const onResetLevel = () => {
    if (currentLevel) {
      // Regenerate letters to reshuffle them
      setLetters(generateLetters(currentLevel.solution, currentLevel.difficulty, language));
    }
    // Full reset including hints
    dispatch({ type: 'RESET', solutionLen: solution.length });
    setNotification(null);
    setWrongAnswers([]); // Clear wrong answers on reset
  };

  const prevLevel = () =>
    currentLevelIndex > 0 && setCurrentLevelIndex(i => i - 1);
  const nextLevel = () =>
    currentLevelIndex < levels.length - 1 && setCurrentLevelIndex(i => i + 1);

  const { slotIndices, answerSlots, hintIndices, gameState } = state;

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4"
      dir={dir}
    >
      <div className="mx-auto max-w-5xl space-y-6">
        {/* ← Back & Team Status */}
        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
            {dir === 'rtl' ? (
              <>
                <ArrowRight className="w-4 h-4" />
                {t.back}
              </>
            ) : (
              <>
                <ArrowLeft className="w-4 h-4" />
                {t.back}
              </>
            )}
          </Button>

          {/* Team badges + scores */}
          {gameMode === 'competitive' && teams.length > 0 && (
            <div className="flex gap-2">
              {teams.map((team, idx) => (
                <Badge
                  key={team.id}
                  variant={idx === currentTeam ? 'default' : 'secondary'}
                  className="px-3"
                >
                  {team.name}: {team.score}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Level & Difficulty */}
        <div className="flex justify-between items-center">
          <Badge variant="secondary">
            {t.level} {currentLevelIndex + 1}
          </Badge>
          <Badge
            variant={
              currentLevel.difficulty === 'easy'
                ? 'default'
                : currentLevel.difficulty === 'medium'
                ? 'secondary'
                : 'destructive'
            }
          >
            {currentLevel.difficulty === 'easy'
              ? t.easy
              : currentLevel.difficulty === 'medium'
              ? t.medium
              : t.hard}
          </Badge>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center">{currentLevel.clue}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Solution & Grid */}
            <SolutionBoxes solution={solution} currentWord={answerSlots.join('')} />
            <LetterGrid
              letters={letters}
              selectedIndices={slotIndices.filter(i => i !== null) as number[]}
              onLetterClick={onLetterClick}
              disabled={gameState !== 'playing'}
              hintIndices={hintIndices}
            />

            {/* Wrong Answers List */}
            {wrongAnswers.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {t.wrongAttempts}:
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {wrongAnswers.map((answer, index) => (
                    <Badge 
                      key={index} 
                      variant="destructive"
                      className="text-xs py-1"
                    >
                      {answer}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Notifications */}
            {notification && (
              <div
                className={`text-center p-4 rounded-lg ${
                  notification.type === 'error'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200'
                    : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
                }`}
              >
                {notification.message}
              </div>
            )}

            {/* Victory */}
            {gameState === 'won' && notification?.type !== 'success' && (
              <div className="text-center">
                <div className="text-green-600 flex items-center justify-center gap-2 mb-4">
                  <Trophy className="h-6 w-6" />
                  <span className="text-lg font-semibold">{t.congrats}</span>
                </div>
              </div>
            )}

            {/* Controls */}
            {gameState !== 'failed' && (
              <GameControls
                onReset={onResetLevel}
                onRemoveLetter={onRemove}
                onClearAnswer={onClear}
                onHint={onHint}
                onCheckAnswer={onCheck}
                onShowSolution={onShow}
                onPrevLevel={prevLevel}
                onNextLevel={nextLevel}
                canRemove={slotIndices.some(i => i !== null && !hintIndices.includes(i))}
                canClear={
                  slotIndices.filter(i => i !== null).length > hintIndices.length
                }
                canCheck={answerSlots.every(ch => ch !== '')}
                canPrev={currentLevelIndex > 0}
                canNext={currentLevelIndex < levels.length - 1}
                gameState={gameState}
                labels={{
                  remove: t.remove,
                  clear: t.clear,
                  hint: t.hint,
                  check: t.check,
                  showSolution: t.showSolution,
                  reset: t.reset,
                  prev: t.prev,
                  next: t.next,
                }}
              />
            )}
          </CardContent>
        </Card>

        {/* Competitive Mode Scoreboard */}
        {gameMode === 'competitive' && teams.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Scoreboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {teams.map((team, index) => (
                  <div 
                    key={team.id} 
                    className={`flex justify-between items-center p-3 rounded-lg ${
                      index === currentTeam ? 'bg-primary/20 border border-primary' : 'bg-muted'
                    }`}
                  >
                    <span className="font-medium">{team.name}</span>
                    <Badge variant={index === currentTeam ? 'default' : 'secondary'}>
                      {team.score}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ClueGameScreen;
