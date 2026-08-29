import { useState } from "react";
import BigButton from "../ui/BigButton.jsx";
import FeedbackBanner from "../ui/FeedbackBanner.jsx";
import ListenButton from "../ui/ListenButton.jsx";

/*
  سحب الكلمات إلى المكان الصحيح
  ==============================
  التفاعل الأساسي هنا هو **اختر ثم ضع** بالنقر، لا السحب. السبب: السحب وحده
  يقصي لوحة المفاتيح ويصعب على الإصبع الصغيرة على شاشة الهاتف. السحب مضاف
  فوقه كتحسين لمن يستعمل الفأرة، لكن كل شيء يعمل كاملاً بالنقر وبمفتاح Tab
  وEnter وحدهما.

  شكل البيانات:
  {
    sentences: [{ before: "زيتونةُ", blank: "answerKey", after: "مُلتَفّةُ الأغصان" }],
    words: ["البُستانِ", "الحقلِ", "البيتِ"],
    answers: { answerKey: "البُستانِ" }
  }
*/

export default function DragToBlankActivity({ activity, onComplete }) {
  const { sentences, words, answers, instruction } = activity.data;
  const [placed, setPlaced] = useState({}); // blankKey -> word
  const [picked, setPicked] = useState(null); // الكلمة المختارة حالياً
  const [status, setStatus] = useState(null);
  const [attempts, setAttempts] = useState(0);

  const usedWords = Object.values(placed);
  const allFilled = sentences.every((s) => placed[s.blank]);

  const place = (blankKey) => {
    if (placed[blankKey]) {
      // النقر على فراغ ممتلئ يعيد كلمته إلى البنك
      setPlaced((p) => {
        const next = { ...p };
        delete next[blankKey];
        return next;
      });
      setStatus(null);
      return;
    }
    if (!picked) return;
    setPlaced((p) => ({ ...p, [blankKey]: picked }));
    setPicked(null);
    setStatus(null);
  };

  const check = () => {
    setAttempts((n) => n + 1);
    const correct = sentences.every((s) => placed[s.blank] === answers[s.blank]);
    setStatus(correct ? "correct" : "wrong");
  };

  const readAloud = sentences
    .map((s) => `${s.before} ${placed[s.blank] ?? "فراغ"} ${s.after}`)
    .join(". ");

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xl font-bold leading-relaxed mb-3">
          {instruction || "اختر الكلمة المناسبة ثم ضعها في الفراغ."}
        </p>
        <ListenButton text={readAloud} label="اقرأ الجمل" size="sm" />
      </div>

      {/* بنك الكلمات */}
      <div className="rounded-3xl bg-surface-alt border border-border p-4">
        <p className="font-bold text-olive-trunk mb-3">🧺 بنك الكلمات</p>
        <div className="flex flex-wrap gap-3">
          {words.map((word) => {
            const used = usedWords.includes(word);
            const active = picked === word;
            return (
              <button
                key={word}
                disabled={used}
                draggable={!used}
                onDragStart={() => setPicked(word)}
                onClick={() => setPicked(active ? null : word)}
                aria-pressed={active}
                className={`rounded-2xl border-2 px-5 py-3 text-lg font-bold transition-all duration-200 active:scale-95 disabled:opacity-30 ${
                  active
                    ? "bg-olive-gold border-olive-gold text-white"
                    : "bg-white border-border text-olive-ink hover:border-olive-green"
                }`}
              >
                {word}
              </button>
            );
          })}
        </div>
        {picked && (
          <p className="mt-3 text-olive-green font-bold">
            اخترت «{picked}» — الآن اضغط على الفراغ المناسب.
          </p>
        )}
      </div>

      {/* الجمل */}
      <div className="space-y-4">
        {sentences.map((s) => (
          <p
            key={s.blank}
            className="rounded-2xl bg-surface border border-border p-5 text-xl leading-loose"
          >
            {s.before}{" "}
            <button
              onClick={() => place(s.blank)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                place(s.blank);
              }}
              aria-label={
                placed[s.blank]
                  ? `الفراغ يحتوي على ${placed[s.blank]} — اضغط لإزالتها`
                  : "فراغ فارغ — اضغط لوضع الكلمة المختارة"
              }
              className={`inline-flex min-w-[7rem] justify-center rounded-xl border-2 border-dashed px-4 py-1.5 font-bold align-middle transition-colors ${
                placed[s.blank]
                  ? "border-olive-green bg-olive-green/10 text-olive-green"
                  : "border-olive-trunk/40 bg-white text-olive-trunk"
              }`}
            >
              {placed[s.blank] ?? "……"}
            </button>{" "}
            {s.after}
          </p>
        ))}
      </div>

      <FeedbackBanner status={status} attempts={attempts} />

      <div className="flex flex-wrap gap-3">
        <BigButton variant="outline" onClick={check} disabled={!allFilled}>
          تحقق من إجابتي
        </BigButton>
        <BigButton
          variant="ghost"
          onClick={() => {
            setPlaced({});
            setPicked(null);
            setStatus(null);
          }}
        >
          ابدأ من جديد ↺
        </BigButton>
        {status === "correct" && (
          <BigButton variant="primary" onClick={() => onComplete(activity.points, placed)}>
            التالي ✅
          </BigButton>
        )}
      </div>
    </div>
  );
}
