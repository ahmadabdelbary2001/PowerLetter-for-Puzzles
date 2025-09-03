// src/features/letter-flow-game/instructions.ts
/**
 * Instructions for the Letter Flow Game
 * Explains how to play the letter flow game and its rules
 */

const EN = {
  title: "Letter Flow Game",
  description: "Connect matching letters on the grid to form words. Trace paths between letter pairs without crossing paths!",
  steps: [
    "Identify matching letters on the grid (they will have the same letter)",
    "Click and drag from one letter to its matching pair to create a path",
    "Paths must be horizontal or vertical (no diagonals)",
    "Paths cannot cross over each other or other letters",
    "Release your mouse/touch when you reach the matching letter",
    "If your path is valid, it will be colored and locked in place",
    "Continue connecting all letter pairs to complete the level",
    "Use 'Undo' to remove your last connection",
    "Use 'Clear' to remove all connections and start over",
    "Use 'Hint' to reveal a valid path (limited in competitive mode)",
    "Complete all connections to win the level!"
  ]
};

const AR = {
  title: "لعبة تدفق الحروف",
  description: "اربط الحروف المتطابقة في الشبكة لتكوين الكلمات. ارسم مسارات بين أزواج الحروف دون عبور المسارات!",
  steps: [
    "حدد الحروف المتطابقة في الشبكة (ستكون لها نفس الحرف)",
    "انقر واسحب من حرف إلى نظيره المطابق لإنشاء مسار",
    "يجب أن تكون المسارات أفقية أو رأسية (بدون أقطار)",
    "لا يمكن للمسارات أن تعبر بعضها البعض أو الحروف الأخرى",
    "افرر فأرتك/لمسك عند الوصول إلى الحرف المطابق",
    "إذا كان مسارك صحيحًا، سيتم تلوينه وتثبيته في مكانه",
    "استمر في ربط جميع أزواج الحروف لإكمال المرحلة",
    "استخدم 'تراجع' لإزالة آخر اتصال لك",
    "استخدم 'مسح' لإزالة جميع الاتصالات والبدء من جديد",
    "استخدم 'تلميح' ليكشف مسار صالح (محدود في الوضع التنافسي)",
    "أكمل جميع الاتصالات للفوز بالمرحلة!"
  ]
};

export function getLetterFlowInstructions(lang?: string) {
  if (typeof lang === "string" && lang.toLowerCase().startsWith("ar")) {
    return AR;
  }
  return EN;
}

export default getLetterFlowInstructions();
