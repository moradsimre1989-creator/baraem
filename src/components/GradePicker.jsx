import { GRADES, useGrade } from "../context/GradeContext.jsx";
import ListenButton from "./ui/ListenButton.jsx";

/*
  شاشة اختيار الصف
  =================
  تُعرض مرة واحدة في أول زيارة، ثم يُحفظ الاختيار. تبقى قابلة للتغيير لاحقاً من
  الشريط العلوي، لأن المعلّمة قد تشغّل الجهاز نفسه لصفّين مختلفين في اليوم نفسه.
*/

const INTRO = "أهلاً بك في وحدة الزيتونة. اختر صفّك لنبدأ الرحلة.";

export default function GradePicker({ onChosen }) {
  const { setGrade } = useGrade();

  const choose = (value) => {
    setGrade(value);
    onChosen?.(value);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-16">
      <div className="text-center mb-10">
        <div className="text-6xl mb-4" aria-hidden>
          🫒
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-olive-ink mb-3">وحدة الزيتونة</h1>
        <p className="text-olive-trunk mb-4">{INTRO}</p>
        <ListenButton text={INTRO} />
      </div>

      <h2 className="text-center font-bold text-2xl mb-6 text-olive-ink">في أي صف أنت؟</h2>

      <div className="grid gap-5 sm:grid-cols-2">
        {GRADES.map((g) => (
          <button
            key={g.value}
            onClick={() => choose(g.value)}
            className="group text-right rounded-3xl border-2 border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-olive-green focus-visible:border-olive-green"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="text-5xl mb-3" aria-hidden>
              {g.emoji}
            </div>
            <div className="text-2xl font-black text-olive-ink mb-1">{g.title}</div>
            <div className="text-olive-green font-bold mb-3">{g.tagline}</div>
            <p className="text-olive-trunk leading-relaxed">{g.description}</p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-cta px-5 py-3 font-bold text-cta-ink">
              ابدأ <span aria-hidden>←</span>
            </div>
          </button>
        ))}
      </div>

      <p className="mt-8 text-center text-olive-trunk">
        يمكنك تغيير الصف في أي وقت من زر الصف في أعلى الشاشة.
      </p>
    </div>
  );
}
