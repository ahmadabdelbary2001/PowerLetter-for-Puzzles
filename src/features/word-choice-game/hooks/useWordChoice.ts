// src/features/word-choice-game/hooks/useWordChoice.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGameMode } from '@/hooks/useGameMode';
import { loadWordChoiceLevels } from '../engine';
import type { WordChoiceLevel } from '../engine';
import { shuffleArray } from '@/lib/gameUtils';

export function useWordChoiceGame() {
  const navigate = useNavigate();
  const params = useParams<{ gameType?: string }>();
  const { language, categories, gameMode, updateScore, currentTeam, teams, nextTurn } = useGameMode();
  const audioRef = useRef<HTMLAudioElement>(null);

  const [levels, setLevels] = useState<WordChoiceLevel[]>([]);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [answerStatus, setAnswerStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

  const currentLevel = levels[currentLevelIndex];

  // --- Asset and Sound Handling ---
  const getAssetPath = (path: string) => {
    const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');
    const assetPath = path.replace(/^\//, '');
    return `${baseUrl}/${assetPath}`;
  };

  const playSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
  }, []);

  // --- Core Game Logic Callbacks ---
  const nextLevel = useCallback(() => {
    if (currentLevelIndex < levels.length - 1) {
      setCurrentLevelIndex(i => i + 1);
      setAnswerStatus('idle');
      setSelectedOption(null);
    } else {
      navigate('/kids-games');
    }
  }, [currentLevelIndex, levels.length, navigate]);

  const handleOptionClick = (option: string) => {
    if (answerStatus !== 'idle') return;

    setSelectedOption(option);
    const isCorrect = option === currentLevel.solution;

    if (isCorrect) {
      setAnswerStatus('correct');
      const points = 10; // All kids' levels are worth 10 points
      if (gameMode === "competitive" && teams.length > 0) {
        updateScore(teams[currentTeam].id, points);
      }
    } else {
      setAnswerStatus('incorrect');
      if (gameMode === 'competitive') {
        nextTurn('lose');
      }
    }
  };

  const handleBack = useCallback(() => navigate(`/game-mode/${params.gameType}`), [navigate, params.gameType]);

  // --- Data Loading and Level Setup Effects ---
  useEffect(() => {
    setLoading(true);
    loadWordChoiceLevels(language, categories)
      .then(setLevels)
      .finally(() => setLoading(false));
  }, [language, categories]);

  useEffect(() => {
    if (currentLevel) {
      const options = shuffleArray([...currentLevel.options, currentLevel.solution]);
      setShuffledOptions(options);
    }
  }, [currentLevel]);

  // Return all state and functions the UI component needs
  return {
    loading,
    currentLevel,
    shuffledOptions,
    answerStatus,
    selectedOption,
    audioRef,
    getAssetPath,
    playSound,
    handleOptionClick,
    nextLevel,
    handleBack,
  };
}
