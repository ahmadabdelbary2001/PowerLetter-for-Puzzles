import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge"
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
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [answer, setAnswer] = useState('');
  const [gameState, setGameState] = useState<'playing' | 'won' | 'failed'>('playing');
  const [loading, setLoading] = useState(true);
  const [letters, setLetters] = useState<string[]>([]);

  const currentLevel = levels[currentLevelIndex];
  const maxLetters = currentLevel?.solution.replace(/\s/g, '').length || 0;

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
    const lvl = levels[currentLevelIndex];
    setLetters(generateLetters(lvl.solution, lvl.difficulty, language));
    setAnswer('');
    setGameState('playing');
  }, [levels, currentLevelIndex, language]);

  if (loading) return <p>Loading...</p>;

  const handleLetterClick = (index: number) => {
    if (gameState !== 'playing') return;
    // Prevent selecting more letters than solution length
    if (selectedIndices.length >= maxLetters && !selectedIndices.includes(index)) return;

    const letter = letters[index];
    if (selectedIndices.includes(index)) {
      const letterPos = selectedIndices.indexOf(index);
      setSelectedIndices(prev => prev.filter(i => i !== index));
      setAnswer(prev => {
        const arr = prev.split('');
        arr.splice(letterPos, 1);
        return arr.join('');
      });
    } else {
      setSelectedIndices(prev => [...prev, index]);
      setAnswer(prev => prev + letter);
    }
  };
  const handleRemove = () => {
    if (selectedIndices.length === 0) return;
    // Remove last selected index
    const updated = [...selectedIndices];
    updated.pop();
    setSelectedIndices(updated);
    // Remove last character from answer
    setAnswer(prev => prev.slice(0, -1));
  };
  const handleClear = () => {
    setSelectedIndices([])
    setAnswer("")
    setGameState("playing")
  }

  const resetGameState = () => {
    setSelectedIndices([])
    setAnswer("")
    setGameState("playing")
  }

  const handleCheck = () => {
    if (answer === currentLevel.solution) {
      setGameState('won');
      if (gameMode === 'competitive') {
        updateScore(
          teams[currentTeam].id,
          currentLevel.difficulty === 'easy' ? 10 : currentLevel.difficulty === 'medium' ? 20 : 30
        );
        nextTurn();
      }
    } else {
      // Error notification and reset level
      window.alert('Incorrect answer. The level will reset.');
      setGameState('failed');
      setSelectedIndices([]);
      setAnswer('');
      setGameState('playing');
    }
  };

  const handleShow = () => {
    if (!currentLevel) return
    
    // Clear current selection
    setSelectedIndices([])
    setAnswer("")
    
    // Set solution
    const solutionLetters = [...currentLevel.solution.replace(/\s/g, '')]
    const newSelectedIndices: number[] = []
    
    solutionLetters.forEach(solutionLetter => {
      const letterIndex = letters.findIndex((letter, index) => 
        letter.toLowerCase() === solutionLetter.toLowerCase() && 
        !newSelectedIndices.includes(index)
      )
      if (letterIndex !== -1) {
        newSelectedIndices.push(letterIndex)
      }
    })
    
    setSelectedIndices(newSelectedIndices)
    setAnswer(currentLevel.solution)
    setGameState("won")
  }

  const nextLevel = () => {
    if (currentLevelIndex < levels.length - 1) {
      setCurrentLevelIndex(idx => idx + 1);
      setSelectedIndices([]);
      setAnswer('');
      setGameState('playing');
    }
  };

  const prevLevel = () => {
    if (currentLevelIndex > 0) {
      setCurrentLevelIndex(idx => idx - 1);
      setSelectedIndices([]);
      setAnswer('');
      setGameState('playing');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> {isRTL ? 'رجوع' : 'Back'}
          </Button>

          <div className="flex items-center gap-4">
            <Badge variant="secondary">
              {isRTL ? 'المستوى' : 'Level'} {currentLevelIndex + 1}
            </Badge>
            <Badge variant="outline">
              {isRTL ? 'الصعوبة' : 'Difficulty'} {currentLevel.difficulty}
            </Badge>
          </div>
        </div>

        {/* Main Game Card */}
        <Card className="mb-6">
          <CardContent className="space-y-8">
            {/* Clue */}
            <div className="text-center">
              <p className="text-xl font-medium">{currentLevel.clue}</p>
            </div>

            {/* Solution Boxes */}
            <SolutionBoxes 
              solution={currentLevel.solution}
              currentWord={answer}
            />

            <LetterGrid
              letters={letters}
              selectedIndices={selectedIndices}
              onLetterClick={handleLetterClick}
              disabled={gameState !== 'playing'}
            />

            {/* Success Message */}
            {gameState === "won" && (
              <div className="text-center">
                <div className="text-green-600 flex items-center justify-center gap-2 text-success mb-4">
                  <Trophy className="h-6 w-6" />
                  <span className="text-lg font-semibold">{isRTL ? 'مبروك!' : 'Congratulations!'}</span>
                </div>
              </div>
            )}

            {/* Game Controls */}
            <GameControls
              onReset={resetGameState}
              onRemoveLetter={handleRemove}
              onClearAnswer={handleClear}
              onCheckAnswer={handleCheck}
              onShowSolution={handleShow}
              onPrevLevel={prevLevel}
              onNextLevel={nextLevel}
              canRemove={!!answer}
              canClear={!!answer}
              canCheck={answer.length === currentLevel.solution.length}
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
