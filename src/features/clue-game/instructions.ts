// src/features/clue-game/instructions.ts
/**
 * Localized instructions provider for the Clue game.
 * Returns an instruction object based on the requested language code.
 */

export type Instructions = {
  title: string;
  description: string;
  steps: string[];
};

const EN: Instructions = {
  title: "Clue-Driven Word Find",
  description:
    "Find the hidden word by selecting letters that match the clue. Use your vocabulary skills to solve the puzzle!",
  steps: [
    "Read the clue at the top of the screen to understand what word you're looking for.",
    "Click on letters from the grid to form your answer.",
    "Use the 'Remove' button to undo your last letter selection.",
    "Use the 'Clear' button to remove all letters and start over.",
    "Use the 'Check' button to submit your answer and see if it's correct.",
    "Use the 'Hint' button if you need help (limited in competitive mode).",
    "Find the correct word before running out of attempts!"
  ],
};

const AR: Instructions = {
  title: "البحث عن الكلمات بالأدلة",
  description:
    "ابحث عن الكلمة المخفية عن طريق اختيار الحروف التي تتطابق مع القرينة. استخدم مفرداتك لحل اللغز!",
  steps: [
    "اقرأ القرينة في أعلى الشاشة لتعرف الكلمة المطلوبة.",
    "انقر على الحروف من الشبكة لتكوين إجابتك.",
    "استخدم زر 'إزالة' للتراجع عن آخر حرف وضعته.",
    "استخدم زر 'مسح' لحذف كل الحروف والبدء من جديد.",
    "اضغط زر 'تحقق' لإرسال إجابتك ومعرفة ما إذا كانت صحيحة.",
    "استخدم زر 'تلميح' إذا احتجت مساعدة (محدود في الوضع التنافسي).",
    "حاول إيجاد الكلمة الصحيحة قبل نفاد المحاولات!"
  ],
};

export function getClueInstructions(lang?: string): Instructions {
  if (typeof lang === "string" && lang.toLowerCase().startsWith("ar")) {
    return AR;
  }
  return EN;
}
