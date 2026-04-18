// --- Views (Shared Pages) ---
export { default as HeroSection } from './views/HeroSection';
export { default as IndexPage } from './views/Index';
export { default as GameTypeSelector } from './views/GameTypeSelector';
export { default as KidsGameSelector } from './views/KidsGameSelector';
export { default as GameSettingsPage } from './views/GameSettingsPage';
export type { GameSettingsPageProps } from './views/GameSettingsPage';
export { default as TeamConfigurator } from './views/TeamConfigurator';
export { default as NotFound } from './views/NotFound';

// --- Atoms ---
export { Badge } from './atoms/Badge';
export { badgeVariants } from './atoms/badge-variants';
export { Button } from './atoms/Button';
export { buttonVariants } from './atoms/button-variants';
export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from './atoms/Card';
export { 
  Dialog, 
  DialogPortal, 
  DialogOverlay, 
  DialogClose, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogFooter, 
  DialogTitle, 
  DialogDescription 
} from './atoms/Dialog';
export { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuRadioGroup
} from './atoms/DropdownMenu';
export { Input } from './atoms/Input';
export { Label } from './atoms/Label';
export { Link } from './atoms/Link';
export { 
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction
} from './atoms/Toast';
export { Toaster } from './atoms/Toaster';
export { Sonner } from './atoms/Sonner';
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './atoms/Tooltip';

// --- Hooks ---
export { useToast, toast } from './hooks/use-toast';
export type { ToasterToast, ToastState } from './hooks/use-toast';
export { cn } from './lib/utils';
export * from './lib/themes';

// --- Contexts ---
export { ThemeProvider } from './contexts/ThemeProvider';
export { useTheme } from './contexts/ThemeContext';
export { LinkProvider, useLinkComponent } from './contexts/LinkContext';
export type { LinkProps, LinkComponent } from './contexts/LinkContext';
export { RouterProvider, useAppRouter, useAppLocation, useAppParams } from './contexts/RouterContext';
export type { AppRouter, AppLocation, NavigateOptions } from './contexts/RouterContext';

// --- Assets/UI Atoms ---
export { GameButton } from './atoms/GameButton';
export { GridCell } from './atoms/GridCell';
export { LetterBox } from './atoms/LetterBox';
export { LetterFlowCell } from './atoms/LetterFlowCell';
export { Logo } from './atoms/Logo';
export { Notification } from './atoms/Notification';
export { SolutionBox } from './atoms/SolutionBox';
export { StepIndicator } from './atoms/StepIndicator';

// --- Molecules ---
export { CategorySelector } from './molecules/CategorySelector';
export { CrosswordGrid } from './molecules/CrosswordGrid';
export { DifficultySelector } from './molecules/DifficultySelector';
export { FoundWords } from './molecules/FoundWords';
export { GameInstructions } from './molecules/GameInstructions';
export { GameProgress } from './molecules/GameProgress';
export { GameSelectionCard } from './molecules/GameSelectionCard';
export { InGameSettings } from './molecules/InGameSettings';
export { LanguageSelector } from './molecules/LanguageSelector';
export { LetterCircle } from './molecules/LetterCircle';
export { LetterFlowBoard } from './molecules/LetterFlowBoard';
export { LetterGrid } from './molecules/LetterGrid';
export { ModeSelector } from './molecules/ModeSelector';
export { ModeToggler } from './molecules/ModeToggler';
export { Scoreboard } from './molecules/Scoreboard';
export { SolutionBoxes } from './molecules/SolutionBoxes';
export { TeamDisplay } from './molecules/TeamDisplay';

// --- Organisms ---
export { Footer } from './organisms/Footer';
export { GameControls } from './organisms/GameControls';
export { GameModeSelector } from './organisms/GameModeSelector';
export { GameScreen } from './organisms/GameScreen';
export { Header } from './organisms/Header';
export { KidsGameModeSelector } from './organisms/KidsGameModeSelector';

// --- Game Organisms (Previously Screens) ---
export { FormationGameScreen } from './organisms/games/formation-game/FormationGameScreen';
export { ImgChoiceScreen } from './organisms/games/img-choice/ImgChoiceScreen';
export { ImgClueGameScreen } from './organisms/games/img-clue/ImgClueGameScreen';
export { LetterFlowGameScreen } from './organisms/games/letter-flow/LetterFlowGameScreen';
export { OutsideStoryScreen } from './organisms/games/outside-story/OutsideStoryScreen';
export { PhraseClueGameScreen } from './organisms/games/phrase-clue/PhraseClueGameScreen';
export { WordChoiceScreen } from './organisms/games/word-choice/WordChoiceScreen';

// --- Registry ---
export { GAME_REGISTRY, getGameConfig } from './registry/GameRegistry';
export type { GameConfig } from './registry/GameRegistry';

// --- Templates ---
export { ClueGameLayout } from './templates/ClueGameLayout';
export { FlowGameLayout } from './templates/FlowGameLayout';
export { GameLayout } from './templates/GameLayout';
export { GameSelectionLayout } from './templates/GameSelectionLayout';
export { GameSelectionPageLayout } from './templates/GameSelectionPageLayout';
export { MultipleChoiceLayout } from './templates/MultipleChoiceLayout';
export { OutsideStoryLayout } from './templates/OutsideStoryLayout';
export { WordFormationLayout } from './templates/WordFormationLayout';
