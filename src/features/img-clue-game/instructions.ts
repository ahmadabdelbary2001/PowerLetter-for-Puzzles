// src/features/img-clue-game/instructions.ts
/**
 * Instructions for the Image Clue Game
 * Explains how to play the image clue game and its rules
 */

const EN = {
  title: "Image Clue Game",
  description: "Guess the word based on the image clue. Type your answer using the keyboard and submit to check if you're right!",
  steps: [
    "Look at the image displayed on the screen carefully",
    "Think about what the image represents",
    "Type your answer using the keyboard",
    "Use 'Remove' to delete the last letter",
    "Use 'Clear' to delete all letters and start over",
    "Use 'Check' to submit your answer",
    "Use 'Hint' to reveal a letter (limited in competitive mode)",
    "If you're correct, you'll see a success message",
    "If you're wrong, try again with a different answer",
    "Complete as many levels as you can!"
  ]
};

const AR = {
  title: "لعبة الدليل الصوري",
  description: "خمن الكلمة بناءً على الدليل البصري. اكتب إجابتك باستخدام لوحة المفاتيح وأرسلها للتحقق من صحتها!",
  steps: [
    "انظر إلى الصورة المعروضة على الشاشة بعناية",
    "فكر في ما تمثله الصورة",
    "اكتب إجابتك باستخدام لوحة المفاتيح",
    "استخدم 'إزالة' لحذف الحرف الأخير",
    "استخدم 'مسح' لحذف جميع الحروف والبدء من جديد",
    "استخدم 'تحقق' لإرسال إجابتك",
    "استخدم 'تلميح' لكشف حرف (محدود في الوضع التنافسي)",
    "إذا كانت إجابتك صحيحة، سترى رسالة نجاح",
    "إذا كانت إجابتك خاطئة، حاول مرة أخرى بإجابة مختلفة",
    "أكمل أكبر عدد ممكن من المراحل!"
  ]
};

export function getImageClueInstructions(lang?: string) {
  if (typeof lang === "string" && lang.toLowerCase().startsWith("ar")) {
    return AR;
  }
  return EN;
}

export default getImageClueInstructions();
