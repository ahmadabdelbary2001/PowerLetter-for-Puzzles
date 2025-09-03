// src/features/word-choice-game/components/WordChoiceScreen.tsx
// This component implements the UI for the Word Choice game where users select the correct word
// that matches an image and sound prompt.
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Volume2, CheckCircle, XCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { GameLayout } from "@/components/templates/GameLayout";
import { useWordChoiceGame } from "@/features/word-choice-game/hooks/useWordChoice";
import { cn } from "@/lib/utils";
import { Notification } from "@/components/atoms/Notification";
import { getWordChoiceInstructions } from "../instructions";
import { useGameMode } from "@/hooks/useGameMode";

const WordChoiceScreen: React.FC = () => {
  // Get translation functions and text direction (for RTL languages)
  const { t, dir } = useTranslation();
  const { language } = useGameMode();

  // Extract all necessary state and functions from the custom hook
  const {
    loading,           // Loading state for data fetching
    currentLevel,      // Current game level data
    shuffledOptions,   // Word options shuffled randomly
    answerStatus,      // Status of user's answer (idle, correct, incorrect)
    selectedOption,    // Currently selected option by user
    audioRef,          // Reference to the audio element
    getAssetPath,      // Function to get the correct asset path
    playSound,         // Function to play the sound
    handleOptionClick, // Function to handle option selection
    nextLevel,         // Function to advance to the next level
    handleBack,        // Function to navigate back
  } = useWordChoiceGame();

  // --- Render Logic ---
  // Show loading state while data is being fetched
  if (loading) {
    return <div className="flex justify-center items-center h-screen"><p>{t.loading}...</p></div>;
  }

  // Show error state if no levels are available or there's an error
  if (!currentLevel || currentLevel.solution === 'ERROR') {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4 p-4 text-center">
        <p className="text-xl font-semibold">{t.noLevelsFound}</p>
        <Button onClick={handleBack}>{t.back}</Button>
      </div>
    );
  }

  // Build notification for success/incorrect attempts
  const showNotif = answerStatus !== 'idle';
  const notifMessage =
    answerStatus === 'correct' ? (t.congrats ?? "Correct!") :
    answerStatus === 'incorrect' ? (t.wrongAnswer ?? "Wrong! Try again") :
    "";
  const notifType = answerStatus === 'correct' ? 'success' : 'error';

  return (
    <GameLayout
      title={t.wordChoiceTitle}
      levelIndex={0}
      onBack={handleBack}
      layoutType="image"
      instructions={getWordChoiceInstructions(language)}
    >
      {/* Show notification when correct/incorrect */}
      {showNotif && (
        <Notification
          message={notifMessage}
          type={notifType}
          duration={1000}
        />
      )}

      {/* Image and Sound Button Section */}
      <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
        {/* Display the image for the current level */}
        <img src={getAssetPath(currentLevel.image)} alt="Guess the word" className="max-h-full max-w-full object-contain" />
        {/* Sound button to play the audio clue */}
        <Button size="icon" onClick={playSound} className="absolute top-3 right-3 rounded-full bg-black/50 hover:bg-black/70">
          <Volume2 className="h-6 w-6 text-white" />
        </Button>
        {/* Hidden audio element that will be played when sound button is clicked */}
        <audio ref={audioRef} src={getAssetPath(currentLevel.sound)} preload="auto" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 max-[200px]:grid-cols-1 gap-3 pt-4">
        {shuffledOptions.map((option) => {
          const isSelected = selectedOption === option;
          const isCorrectSolution = option === currentLevel.solution;

          return (
            <Button
              key={option}
              onClick={() => handleOptionClick(option)}
              // disable only while a correct answer is being processed
              disabled={answerStatus === 'correct'}
              className={cn(
                "text-base h-16 flex items-center justify-center gap-2 transition-all duration-300",
                isSelected && answerStatus === 'correct' && "bg-green-500 hover:bg-green-600 border-2 border-green-700",
                isSelected && answerStatus === 'incorrect' && "bg-red-500 hover:bg-red-500 border-2 border-red-700",
                !isSelected && answerStatus === 'incorrect' && isCorrectSolution && "bg-green-200 text-green-800 border-2 border-green-400",
                answerStatus === 'idle' && "bg-card text-card-foreground hover:bg-muted"
              )}
            >
              {option}
              {isSelected && answerStatus === 'correct' && <CheckCircle />}
              {isSelected && answerStatus === 'incorrect' && <XCircle />}
            </Button>
          );
        })}
      </div>

      {/* Next Level Button - only appears after correct answer */}
      {answerStatus === 'correct' && (
        <div className="pt-4">
          <Button onClick={nextLevel} className="w-full bg-green-600 hover:bg-green-700 text-lg py-6">
            {t.next} {dir === 'rtl' ? <ArrowLeft className="ml-2" /> : <ArrowRight className="ml-2" />}
          </Button>
        </div>
      )}
    </GameLayout>
  );
};

export default WordChoiceScreen;
