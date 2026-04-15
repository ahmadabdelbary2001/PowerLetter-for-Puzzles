"use client";

// src/screens/outside-story/components/RoleRevealPlayerScreen.tsx
import React from "react";
import { Button } from "@ui/atoms/Button";
import type { UseOutsideStoryResult } from "@powerletter/core";

type Props = { game: UseOutsideStoryResult };

export const RoleRevealPlayerScreen: React.FC<Props> = ({ game }) => {
  const { t, players, currentRound, currentPlayerTurn, nextTurn } = game;
  const player = players[currentPlayerTurn];
  const isOutsider = player.id === currentRound?.outsiderId;

  const handleContinue = () => {
    nextTurn(); // The hook now handles whether to go to handoff or question_intro
  };

  // --- Get the category name from the current round ---
  // We also get the translated version of the category name.
  const categoryName = currentRound?.category ?? "";
  const translatedCategory = t[categoryName as keyof typeof t] ?? categoryName;

  return (
    <div className="text-center max-w-md">
      <h2 className="text-3xl font-bold mb-4">{player.name}</h2>
      {isOutsider ? (
        <p className="text-xl">
          {/* --- Pass the category to the translation function --- */}
          {t("youAreTheOutsider", { ns: "outside_the_story" })?.replace(
            "{category}",
            String(translatedCategory)
          )}
        </p>
      ) : (
        <p className="text-xl">
          {t("youAreAnInsider", { ns: "outside_the_story" })?.replace(
            "{secret}",
            currentRound?.secret ?? ""
          )}
        </p>
      )}
      <Button onClick={handleContinue} className="mt-8 w-full">
        {t("next")}
      </Button>
    </div>
  );
};
