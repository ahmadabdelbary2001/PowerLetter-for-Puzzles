// src/features/formation-game/instructions.ts
/**
 * Instructions for the Formation Game
 * Explains how to play the formation game and its rules
 */

const EN = {
  title: "Formation Game",
  description: "Form words by connecting letters on the grid. Create as many words as possible using the given letters!",
  steps: [
    "Look at the grid of letters and try to form words",
    "Click on letters to select them and form a word",
    "Words must be at least 2 letters long",
    "You can use each letter only once per word",
    "Click 'Remove' to undo your last letter selection",
    "Click 'Clear' to start over with a new word",
    "Click 'Check' to submit your word",
    "Click 'Hint' if you need help finding a word (limited in competitive mode)",
    "Try to find all the words on the grid!"
  ]
};

const AR = {
  title: "لعبة التشكيل",
  description: "شكّل الكلمات عن طريق ربط الحروف على الشبكة. أنشئ أكبر عدد ممكن من الكلمات باستخدام الحروف المعطاة!",
  steps: [
    "انظر إلى شبكة الحروف وحاول تكوين الكلمات",
    "انقر على الحروف لتحديدها وتكوين كلمة",
    "يجب أن تكون الكلمات طويلة على الأقل بحرفين",
    "يمكنك استخدام كل حرف مرة واحدة فقط في كل كلمة",
    "انقر على 'إزالة' للتراجع عن اختيارك للحرف الأخير",
    "انقر على 'مسح' للبدء من جديد بكلمة جديدة",
    "انقر على 'تحقق' لإرسال كلمتك",
    "انقر على 'تلميح' إذا احتجت مساعدة في إيجاد كلمة (محدود في الوضع التنافسي)",
    "حاول إيجاد جميع الكلمات في الشبكة!"
  ]
};

export function getFormationInstructions(lang?: string) {
  if (typeof lang === "string" && lang.toLowerCase().startsWith("ar")) {
    return AR;
  }
  return EN;
}

export default getFormationInstructions();
