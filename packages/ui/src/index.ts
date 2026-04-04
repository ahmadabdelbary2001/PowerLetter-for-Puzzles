// src/index.ts entry point for @powerletter/ui package

// --- Atoms ---
export { Badge, badgeVariants } from './atoms/Badge';
export { Button, buttonVariants } from './atoms/Button';
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

// --- Contexts ---
export { ThemeProvider } from './contexts/ThemeProvider';
export { useTheme } from './contexts/ThemeContext';

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

// --- Templates ---
export { ClueGameLayout } from './templates/ClueGameLayout';
export { FlowGameLayout } from './templates/FlowGameLayout';
export { GameLayout } from './templates/GameLayout';
export { GameSelectionLayout } from './templates/GameSelectionLayout';
export { GameSelectionPageLayout } from './templates/GameSelectionPageLayout';
export { MultipleChoiceLayout } from './templates/MultipleChoiceLayout';
export { OutsideStoryLayout } from './templates/OutsideStoryLayout';
export { WordFormationLayout } from './templates/WordFormationLayout';

// --- Game Features (Screens) ---
export { FormationGameScreen } from './screens/formation-game/FormationGameScreen';
export { ImgChoiceScreen } from './screens/img-choice/ImgChoiceScreen';
export { ImgClueGameScreen } from './screens/img-clue/ImgClueGameScreen';
export { LetterFlowGameScreen } from './screens/letter-flow/LetterFlowGameScreen';
export { OutsideStoryScreen } from './screens/outside-story/OutsideStoryScreen';
export { PhraseClueGameScreen } from './screens/phrase-clue/PhraseClueGameScreen';
export { WordChoiceScreen } from './screens/word-choice/WordChoiceScreen';
