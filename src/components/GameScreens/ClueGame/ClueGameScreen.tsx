import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
    if (gameState !== "playing") return

    const letter = letters[index]
    
    if (selectedIndices.includes(index)) {
      // Remove letter
      const letterIndex = selectedIndices.indexOf(index)
      setSelectedIndices(prev => prev.filter(i => i !== index))
      setAnswer(prev => {
        const wordArray = [...prev]
        wordArray.splice(letterIndex, 1)
        return wordArray.join('')
      })
    } else {
      // Add letter
      setSelectedIndices(prev => [...prev, index])
      setAnswer(prev => prev + letter)
    }
  }
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
      // update score
      if (gameMode === 'competitive') {
        updateScore(teams[currentTeam].id, currentLevel.difficulty === 'easy' ? 10 : currentLevel.difficulty === 'medium' ? 20 : 30);
        nextTurn();
      }
    } else {
      setGameState('failed');
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
    <div className="p-4 max-w-xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
      <Button variant="outline" onClick={onBack} className="mb-4">
        <ArrowLeft /> {isRTL ? 'رجوع' : 'Back'}
      </Button>

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
          {gameState === 'won' && (
            <div className="text-center text-green-600">
              <Trophy /> {isRTL ? 'مبروك!' : 'Congratulations!'}
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
  );
};

export default ClueGameScreen;
