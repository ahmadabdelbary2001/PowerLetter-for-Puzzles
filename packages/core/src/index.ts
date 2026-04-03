export * from './types/game';
export * from './stores/useGameSettingsStore';
export * from './stores/useTeamStore';
export * from './i18n/resources';

// Hooks
export * from './hooks/useTranslation';
export * from './hooks/useGameMode';
// export * from './hooks/useTheme'; // Removed to avoid collision with contexts/ThemeContext

// Games
export * from './games/GameRegistry';

// Atoms & Molecules
export { default as Logo } from './components/atoms/Logo';
export { default as LanguageSelector } from './components/molecules/LanguageSelector';
export { default as ModeToggler } from './components/molecules/ModeToggler';
export { DifficultySelector } from './components/molecules/DifficultySelector';
export { CategorySelector } from './components/molecules/CategorySelector';
export { GameSelectionCard } from './components/molecules/GameSelectionCard';
export { default as GameInstructions } from './components/molecules/GameInstructions';
export { InGameSettings } from './components/molecules/InGameSettings';
export { Scoreboard } from './components/molecules/Scoreboard';
export { TeamDisplay } from './components/molecules/TeamDisplay';
export { LetterGrid } from './components/molecules/LetterGrid';
export { LetterCircle } from './components/molecules/LetterCircle';
export { LetterFlowBoard } from './components/molecules/LetterFlowBoard';
export { SolutionBoxes } from './components/molecules/SolutionBoxes';

// Organisms
export { default as Header } from './components/organisms/Header';
export { default as Footer } from './components/organisms/Footer';
export { GameScreen } from './components/organisms/GameScreen';
export { default as GameModeSelector } from './components/organisms/GameModeSelector';
export { default as KidsGameModeSelector } from './components/organisms/KidsGameModeSelector';
export { ThemeProvider } from './contexts/ThemeProvider';
export * from './contexts/ThemeContext';

// Templates
export { GameLayout } from './components/templates/GameLayout';
export { GameSelectionLayout } from './components/templates/GameSelectionLayout';
export { GameSelectionPageLayout } from './components/templates/GameSelectionPageLayout';
export { OutsideStoryLayout } from './components/templates/OutsideStoryLayout';
export { MultipleChoiceLayout } from './components/templates/MultipleChoiceLayout';
export { WordFormationLayout } from './components/templates/WordFormationLayout';
export { FlowGameLayout } from './components/templates/FlowGameLayout';
