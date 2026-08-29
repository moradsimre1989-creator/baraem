import { useEffect } from "react";
import { playCorrect } from "../../utils/sound.js";

/*
  شريط التغذية الراجعة
  =====================
  الرسالة تتدرّج مع عدد المحاولات بدل تكرار «حاول مرة أخرى» بلا فائدة: المحاولة
  الأولى تشجّع، والثانية توجّه إلى مكان الدليل، والثالثة تقترب أكثر. الحلّ لا
  يُعرض في أي محاولة — الطالب هو من يصل إليه، وهذا شرط تربوي لا تفصيل شكلي.
*/

const CORRECT_MESSAGES = [
  "أحسنت! إجابة صحيحة 🎉",
  "ممتاز! أصبت 🌟",
  "رائع، هذه هي الإجابة الصحيحة 👏",
];

const HINT_MESSAGES = [
  "ليست هذه الإجابة، حاول مرة أخرى.",
  "انظر إلى الصورة أو النص جيداً وابحث عن دليل.",
  "اقتربت من الإجابة الصحيحة — فكّر مرة أخرى بهدوء.",
  "خذ وقتك، اقرأ السؤال ببطء ثم اختر.",
];

/** رسالة ثابتة لنفس المحاولة (لا تتغيّر عند إعادة الرسم) */
function pick(list, index) {
  return list[Math.min(index, list.length - 1)];
}

export default function FeedbackBanner({
  status,
  correctText,
  hintText,
  attempts = 0,
}) {
  const isCorrect = status === "correct";

  // النغمة تُشغَّل مرة واحدة عند أول ظهور لحالة «صحيح»، لا في كل إعادة رسم.
  useEffect(() => {
    if (isCorrect) playCorrect();
  }, [isCorrect, attempts]);

  if (!status) return null;

  const message = isCorrect
    ? correctText || pick(CORRECT_MESSAGES, Math.max(attempts - 1, 0))
    : hintText || pick(HINT_MESSAGES, Math.max(attempts - 1, 0));

  return (
    <div
      className={`rounded-2xl px-5 py-4 text-base font-bold flex items-center gap-3 border transition-all duration-300 ${
        isCorrect
          ? "bg-green-50 text-green-800 border-green-200"
          : "bg-amber-50 text-amber-800 border-amber-200"
      }`}
      role="status"
      aria-live="polite"
    >
      <span className="text-2xl" aria-hidden>
        {isCorrect ? "✅" : "💡"}
      </span>
      <span>{message}</span>
    </div>
  );
}
