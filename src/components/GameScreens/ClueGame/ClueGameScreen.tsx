import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SolutionBoxes } from './SolutionBoxes';
import { LetterGrid } from './LetterGrid';
import GameControls from './GameControls';
import { ArrowLeft, Trophy } from 'lucide-react';
import { useGameMode } from '@/contexts/GameModeContext';
import { loadLevels, generateLetters } from '../../../lib/gameUtils';
import type { Difficulty } from '@/contexts/GameModeContext';

interface ClueGameScreenProps {
  onBack: () => void;
}

const ClueGameScreen: React.FC<ClueGameScreenProps> = ({ onBack }) => {
  const { isRTL, language, gameMode, updateScore, currentTeam, teams, nextTurn } = useGameMode();

  const [levels, setLevels] = useState<{ id: string; difficulty: Difficulty; clue: string; solution: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [letters, setLetters] = useState<string[]>([]);
  const [answer, setAnswer] = useState('');
  const [state, setState] = useState<'playing' | 'won' | 'failed'>('playing');

  // load levels
  useEffect(() => {
    loadLevels(language).then(lvls => {
      setLevels(lvls);
      setLoading(false);
    });
  }, [language]);

  // generate letters when level changes
  useEffect(() => {
    if (!levels.length) return;
    const lvl = levels[index];
    setLetters(generateLetters(lvl.solution, lvl.difficulty, language));
    setAnswer('');
    setState('playing');
  }, [levels, index, language]);

  const lvl = levels[index];
  if (loading) return <p>Loading...</p>;

  const handleAdd = (letter: string) => {
    if (answer.length < lvl.solution.length && state === 'playing') {
      setAnswer(prev => prev + letter);
    }
  };
  const handleRemove = () => state === 'playing' && setAnswer(prev => prev.slice(0, -1));
  const handleClear = () => state === 'playing' && setAnswer('');

  const handleCheck = () => {
    if (answer === lvl.solution) {
      setState('won');
      // update score
      if (gameMode === 'competitive') {
        updateScore(teams[currentTeam].id, lvl.difficulty === 'easy' ? 10 : lvl.difficulty === 'medium' ? 20 : 30);
        nextTurn();
      }
    } else {
      setState('failed');
    }
  };

  const handleShow = () => state === 'playing' && setAnswer(lvl.solution);
  const prev = () => index > 0 && setIndex(i => i - 1);
  const next = () => index < levels.length - 1 && setIndex(i => i + 1);

  return (
    <div className="p-4 max-w-xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
      <Button variant="outline" onClick={onBack} className="mb-4">
        <ArrowLeft /> {isRTL ? 'رجوع' : 'Back'}
      </Button>

      <Card>
        <CardHeader className="text-center">
          <CardTitle>{lvl.clue}</CardTitle>
          <Badge>{lvl.difficulty}</Badge>
        </CardHeader>
        <CardContent>
          <SolutionBoxes solution={lvl.solution} currentWord={answer} />
          <LetterGrid
            letters={letters}
            selectedIndices={answer.split('').map(ch => letters.indexOf(ch))}
            onLetterClick={(idx: number) => handleAdd(letters[idx])}
            disabled={state !== 'playing'}
          />
          {state === 'won' && (
            <div className="text-center text-green-600">
              <Trophy /> {isRTL ? 'مبروك!' : 'Congratulations!'}
            </div>
          )}
          <GameControls
            onRemoveLetter={handleRemove}
            onClearAnswer={handleClear}
            onCheckAnswer={handleCheck}
            onShowSolution={handleShow}
            onPrevLevel={prev}
            onNextLevel={next}
            canRemove={!!answer}
            canClear={!!answer}
            canCheck={answer.length === lvl.solution.length}
            canPrev={index > 0}
            canNext={index < levels.length - 1}
            gameState={state}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ClueGameScreen;
