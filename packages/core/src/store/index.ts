// Store barrel export — centralised access to all Zustand stores

export { useGameStore } from './slices/gameStore';
export type { GameState } from '@core/types/game';

export { useLessonStore } from './slices/lessonStore';
export type { LessonCategory, LessonStatus, LessonProgress } from './slices/lessonStore';

export { usePathStore } from './slices/pathStore';
export type { LearningPath, PathStep } from './slices/pathStore';

export { useSearchStore } from './slices/searchStore';
export type { SearchResult } from './slices/searchStore';

export { useLayoutStore } from './slices/layoutStore';
export type { SidebarState, ViewMode } from './slices/layoutStore';

export { useThemeStore } from './slices/themeStore';
export type { ColorScheme, AccentColor, FontSize, BorderRadius } from './slices/themeStore';

export { useUserStore } from './slices/userStore';
export type { UserProfile } from './slices/userStore';

export { useGameSettingsStore } from './slices/gameSettingsStore';
export { useTeamStore } from './slices/teamStore';
