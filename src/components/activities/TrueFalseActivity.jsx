import { useState } from "react";
import BigButton from "../ui/BigButton.jsx";
import FeedbackBanner from "../ui/FeedbackBanner.jsx";
import ListenButton from "../ui/ListenButton.jsx";
import { altFor } from "../../data/photoCredits.js";

/*
  صح أم خطأ
  ==========
  كانت أسئلة الصح/الخطأ تُبنى على `mcq` بخيارين نصّيين. النوع المستقلّ يعطيها
  الشكل الذي يتوقّعه الطالب: زرّان كبيران بلون ورمز واضحين، بلا قراءة خيارات.
  شكل البيانات: { statement, isTrue, image?, imageAlt?, why? }
*/

export default function TrueFalseActivity({ activity, onComplete }) {
  const { statement, isTrue, image, imageAlt, why, level } = activity.data;
  const [choice, setChoice] = useState(null);
  const [status, setStatus] = useState(null);
  const [attempts, setAttempts] = useState(0);

  const check = () => {
    if (choice === null) return;
    setAttempts((n) => n + 1);
    setStatus(choice === isTrue ? "correct" : "wrong");
  };

  const answer = (value) => {
    setChoice(value);
    setStatus(null);
  };

  const OPTIONS = [
    { value: true, label: "صح", emoji: "✔️", tone: "bg-olive-green text-white border-olive-green" },
    { value: false, label: "خطأ", emoji: "✖️", tone: "bg-rose text-white border-rose" },
  ];

  return (
    <div className="space-y-5">
      {level && (
        <span className="inline-block bg-olive-cream border border-olive-green/30 rounded-full px-3 py-1 text-sm text-olive-trunk">
          {level}
        </span>
      )}

      {image && (
        <img
          src={image}
          alt={imageAlt ?? altFor(image)}
          loading="lazy"
          decoding="async"
          className="w-full h-48 object-cover rounded-2xl"
        />
      )}

      <p className="text-xl font-bold leading-relaxed">{statement}</p>
      <ListenButton text={statement} label="اقرأ الجملة" size="sm" />

      <div className="grid grid-cols-2 gap-4">
        {OPTIONS.map((opt) => {
          const active = choice === opt.value;
          return (
            <button
              key={String(opt.value)}
              onClick={() => answer(opt.value)}
              aria-pressed={active}
              className={`flex flex-col items-center gap-2 rounded-3xl border-2 py-7 text-2xl font-black transition-all duration-200 active:scale-95 ${
                active ? opt.tone : "bg-white border-border text-olive-ink hover:border-olive-green"
              }`}
            >
              <span className="text-4xl" aria-hidden>
                {opt.emoji}
              </span>
              {opt.label}
            </button>
          );
        })}
      </div>

      <FeedbackBanner status={status} attempts={attempts} />

      {status === "correct" && why && (
        <p className="rounded-2xl bg-pastel-blue px-5 py-4 leading-relaxed text-olive-ink">
          <span className="font-bold">لماذا؟ </span>
          {why}
        </p>
      )}

      <div className="flex gap-3">
        <BigButton variant="outline" onClick={check} disabled={choice === null}>
          تحقق من إجابتي
        </BigButton>
        {status === "correct" && (
          <BigButton variant="primary" onClick={() => onComplete(activity.points, { choice })}>
            التالي ✅
          </BigButton>
        )}
      </div>
    </div>
  );
}
