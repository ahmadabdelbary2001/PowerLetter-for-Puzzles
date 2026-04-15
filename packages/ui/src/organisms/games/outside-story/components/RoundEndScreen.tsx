"use client";

// src/screens/outside-story/components/RoundEndScreen.tsx
import React from "react";
import { Button } from "@ui/atoms/Button";
import { useAppRouter } from "@ui/contexts/RouterContext";
import type { useOutsideStory } from "@powerletter/core";

type Props = { game: ReturnType<typeof useOutsideStory> };

export const RoundEndScreen: React.FC<Props> = ({ game }) => {
  const { t, playAgain, changePlayersAndReset } = game;
  const router = useAppRouter();

  const handleChangePlayers = () => {
    changePlayersAndReset();
    // Use canonical game id route for team setup
    router.push("/team-config/outside-the-story");
  };

  const handleGoHome = () => {
    router.push("/games");
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-4 text-center">
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <span className="text-5xl">🏁</span>
      </div>

      <h2 className="text-3xl font-black mb-4 tracking-tight">
        {t("roundEndTitle", { ns: "outside_the_story" }) || "انتهت الجولة!"}
      </h2>

      <p className="text-xl opacity-70 mb-10 leading-relaxed">
        {t("roundEndInstruction", { ns: "outside_the_story" }) ||
          "هل تود لعب جولة أخرى بكلمة جديدة أم تغيير الفريق؟"}
      </p>

      <div className="flex flex-col gap-4 w-full">
        <Button
          onClick={playAgain}
          size="lg"
          className="w-full h-16 text-xl rounded-2xl shadow-lg border-2 border-primary"
        >
          {t("playAgain", { ns: "outside_the_story" }) || "أكمل اللعب"}
        </Button>

        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={handleChangePlayers}
            variant="secondary"
            className="h-14 rounded-xl border border-border"
          >
            {t("changePlayers", { ns: "outside_the_story" }) || "تغيير الفريق"}
          </Button>

          <Button
            onClick={handleGoHome}
            variant="ghost"
            className="h-14 rounded-xl opacity-60 hover:opacity-100"
          >
            {t("quitGame", { ns: "outside_the_story" }) || "خروج"}
          </Button>
        </div>
      </div>
    </div>
  );
};
