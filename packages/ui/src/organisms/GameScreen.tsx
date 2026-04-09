// src/components/organisms/GameScreen.tsx
/**
 * @description A higher-order component that handles the common boilerplate for rendering a game screen.
 * It manages loading and error states, and injects game state and handlers into the provided GameComponent.
 * This pattern centralizes repetitive logic, keeping individual game screens clean and focused on their unique UI.
 */
import { Button } from '../atoms/Button';
import { useTranslation } from '@powerletter/core';
import { useAppRouter, useAppParams } from '../contexts/RouterContext';

// Define the minimum shape that any game hook MUST return.
interface BaseGameProps {
  loading: boolean;
  currentLevel: { solution: string } | null;
  handleBack: () => void;
  handleBackWith: (navigate: (path: string) => void, gameType?: string) => void;
}

// Define a generic type for any game hook that extends the base shape.
type UseGameHook<T extends BaseGameProps> = () => T;

// The props for our HOC. It accepts a hook and a component that can handle the hook's return type.
interface GameScreenWrapperProps<T extends BaseGameProps> {
  useGameHook: UseGameHook<T>;
  GameComponent: React.FC<T>;
}

export function GameScreen<T extends BaseGameProps>({ useGameHook, GameComponent }: GameScreenWrapperProps<T>) {
  const { t } = useTranslation();
  const router = useAppRouter();
  const { gameType } = useAppParams<{ gameType?: string }>();
  const gameProps = useGameHook();

  // Error state back handler — goes back using gameType for correct routing
  const handleErrorBack = () => {
    if (gameProps.handleBackWith) {
      gameProps.handleBackWith(router.push, gameType);
    } else {
      router.push('/games');
    }
  };

  // 1. Handle the initial loading state.
  if (gameProps.loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-2xl animate-pulse" suppressHydrationWarning>{t('loading')}...</p>
      </div>
    );
  }

  // 2. Handle the case where loading is finished but no valid level was found.
  if (!gameProps.currentLevel || gameProps.currentLevel.solution === 'ERROR') {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4 p-4 text-center">
        <p className="text-xl font-semibold">{t('noLevelsFound')}</p>
        <Button onClick={handleErrorBack}>{t('back')}</Button>
      </div>
    );
  }

  // 3. If loading is complete and there are no errors, render the main game layout.
  return (
    <GameComponent {...gameProps} />
  );
}
