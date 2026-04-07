"use client";

import {
  IndexPage,
  KidsGameSelector,
  GameTypeSelector,
  GameModeSelector,
  KidsGameModeSelector,
  GameSettingsPage,
  TeamConfigurator,
  NotFound,
  getGameConfig,
} from "@powerletter/ui";
import { useAppLocation } from "@powerletter/ui";
import { Suspense } from "react";

/**
 * Universal Catch-All Page — mirrors the desktop-mobile App.tsx routing logic.
 * Next.js [[...slug]] catches every URL and delegates to the right UI component
 * based on the current pathname (parsed by NextRouterAdapter → useAppLocation).
 */
export default function UniversalPage() {
  const location = useAppLocation();
  const path = location.pathname;

  // Parse params from pathname (same way desktop-mobile uses react-router useParams)
  const parts = path.split("/").filter(Boolean);
  const segment0 = parts[0] ?? "";
  const segment1 = parts[1] ?? "";
  const segment2 = parts[2] ?? "";

  // 1. Root
  if (path === "/" || path === "") {
    return <IndexPage />;
  }

  // 2. Games list
  if (path === "/games") {
    return <GameTypeSelector />;
  }

  // 3. Kids games list
  if (path === "/kids-games") {
    return <KidsGameSelector />;
  }

  // 4. Game Mode selector  →  /game-mode/:gameType
  if (segment0 === "game-mode" && segment1) {
    const config = getGameConfig(segment1);
    if (config?.type === "kids") {
      return <KidsGameModeSelector gameType={segment1} />;
    }
    return <GameModeSelector gameType={segment1} />;
  }

  // 5. Team configuration  →  /team-config/:gameType  OR  /settings/teams/:gameType
  if (
    (segment0 === "team-config" && segment1) ||
    (segment0 === "settings" && segment1 === "teams" && segment2)
  ) {
    const gameType = segment0 === "team-config" ? segment1 : segment2;
    return <TeamConfigurator gameType={gameType} />;
  }

  // 6. Game Settings (difficulty / category)  →  /settings/:settingType/:gameType
  if (segment0 === "settings" && segment1 && segment2) {
    return (
      <GameSettingsPage
        settingType={segment1 as "difficulty" | "category"}
        gameType={segment2}
      />
    );
  }

  // 7. Game execution  →  /game/:gameType
  if (segment0 === "game" && segment1) {
    const config = getGameConfig(segment1);
    if (config) {
      const GameComponent = config.component;
      return (
        <Suspense
          fallback={
            <div className="flex h-screen items-center justify-center">
              Loading Game...
            </div>
          }
        >
          <GameComponent />
        </Suspense>
      );
    }
  }

  // 8. Fallback
  return <NotFound />;
}
