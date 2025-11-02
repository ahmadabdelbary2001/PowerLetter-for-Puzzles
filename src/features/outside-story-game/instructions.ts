// src/features/outside-story-game/instructions.ts
import { useTranslation } from "react-i18next";

export function useOutsideStoryInstructions() {
  const { i18n } = useTranslation();
  const lang = i18n.language?.toLowerCase() || 'en';

  return lang.startsWith('ar') ? {
    title: "برا السالفة",
    description: "لعبة الخداع والاستنتاج حيث أحد اللاعبين لا يعرف الكلمة السرية.",
    steps: [
      "تختار التطبيق كلمة سرية عشوائية وتعينها لجميع اللاعبين ما عدا واحد",
      "اللاعب الذي لا يعرف الكلمة السرية هو 'برا السالفة'",
      "اللاعبون الذين يعرفون الكلمة يطرحون أسئلة ذكية عنها",
      "يحاول لاعب 'برا السالفة' خداع الآخرين",
      "بعد مرحلة الأسئلة، يصوت اللاعبون على من يعتقدون أنه 'برا السالفة'",
      "إذا تم تحديد اللاعب الخارج بشكل صحيح، يتم منح نقاط"
    ]
  } : {
    title: "Outside the Story",
    description: "A game of deception and deduction where one player doesn't know the secret word.",
    steps: [
      "The app randomly selects a secret word and assigns it to all but one player",
      "The player who doesn't know the secret word is 'Outside the Story'",
      "Players who know the word ask clever questions about it",
      "The 'Outside the Story' player tries to deceive others",
      "After the questioning phase, players vote on who they think is 'Outside the Story'",
      "If the outside player is correctly identified, points are awarded"
    ]
  };
}
