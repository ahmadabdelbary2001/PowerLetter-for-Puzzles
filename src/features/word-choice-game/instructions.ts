// src/features/word-choice-game/instructions.ts
/**
 * Instructions for the Word Choice Game
 * Explains how to play the word choice game and its rules
 */

const EN = {
  title: "Word Choice Game",
  description: "Select the correct word that matches the image and sound prompt. Test your vocabulary and observation skills!",
  steps: [
    "Look at the image displayed on the screen",
    "Press the sound button to hear the word pronounced",
    "Read the word options provided",
    "Click on the word that matches both the image and sound",
    "If you choose correctly, you'll see a success message and move to the next level",
    "If you choose incorrectly, you'll get feedback and can try again",
    "Complete as many levels as you can!"
  ]
};

const AR = {
  title: "لعبة اختيار الكلمة",
  description: "اختر الكلمة الصحيحة التي تتطابق مع الصورة والصوت. اختبر مفرداتك ومهاراتك الملاحظة!",
  steps: [
    "انظر إلى الصورة المعروضة على الشاشة",
    "اضغط على زر الصوت لسماع نطق الكلمة",
    "اقرأ خيارات الكلمات المعروضة",
    "انقر على الكلمة التي تتطابق مع الصورة والصوت معًا",
    "إذا اخترت بشكل صحيح، سترى رسالة نجاح وتنتقل إلى المرحلة التالية",
    "إذا اخترت بشكل غير صحيح، ستحصل على ملاحظات ويمكنك المحاولة مرة أخرى",
    "أكمل أكبر عدد ممكن من المراحل!"
  ]
};

export function getWordChoiceInstructions(lang?: string) {
  if (typeof lang === "string" && lang.toLowerCase().startsWith("ar")) {
    return AR;
  }
  return EN;
}

export default getWordChoiceInstructions();
