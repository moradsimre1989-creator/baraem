import { useState } from "react";
import BigButton from "../ui/BigButton.jsx";

export default function WordBuildActivity({ activity, onComplete }) {
  const { letters, minWordLength, hint, targetWords } = activity.data;
  const [current, setCurrent] = useState([]);
  const [found, setFound] = useState([]);
  const [message, setMessage] = useState(null);

  const addLetter = (letter) => setCurrent((c) => [...c, letter]);
  const backspace = () => setCurrent((c) => c.slice(0, -1));
  const clear = () => setCurrent([]);

  const check = () => {
    const word = current.join("");
    if (word.length < minWordLength) {
      setMessage({ ok: false, text: "الكلمة قصيرة جداً، أضف حروفاً أكثر" });
      return;
    }
    if (found.includes(word)) {
      setMessage({ ok: false, text: "وجدت هذه الكلمة من قبل!" });
      return;
    }
    if (targetWords.includes(word)) {
      setFound((f) => [...f, word]);
      setMessage({ ok: true, text: `أحسنت! كلمة صحيحة: ${word}` });
      setCurrent([]);
    } else {
      setMessage({ ok: false, text: "هذه ليست كلمة من الكلمات المطلوبة، حاول مرة أخرى" });
    }
  };

  return (
    <div className="space-y-5">
      <p className="text-olive-trunk">{hint}</p>

      {/*
        الكلمة تُعرض موصولة الحروف: join("") لا join(" "). المسافة بين المقطعين
        تقطع الوصل في العربية فتظهر «زي تو نة» بحروف منفصلة، والطفل يتعلّم شكل
        الكلمة كما تُكتب لا كما تقطّعها الأزرار. التحقّق كان يستعمل النصّ الموصول
        أصلاً، فالعطل كان في العرض وحده.
      */}
      <div className="min-h-16 flex items-center justify-center rounded-2xl border-2 border-dashed border-olive-green/40 p-3 text-4xl font-bold">
        {current.length === 0 ? (
          <span className="text-olive-trunk/40 text-lg">اضغط الحروف لتكوين كلمة</span>
        ) : (
          <span className="font-quran">{current.join("")}</span>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {letters.map((l, i) => (
          <button
            key={i}
            onClick={() => addLetter(l)}
            className="w-14 h-14 rounded-xl bg-olive-green text-white text-2xl font-bold shadow hover:bg-[#3d6320] active:scale-95"
          >
            {l}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <BigButton variant="outline" className="!px-4 !py-2 text-base" onClick={backspace}>
          ⌫ تراجع
        </BigButton>
        <BigButton variant="outline" className="!px-4 !py-2 text-base" onClick={clear}>
          مسح
        </BigButton>
        <BigButton variant="gold" className="!px-4 !py-2 text-base" onClick={check}>
          تحقق من الكلمة
        </BigButton>
      </div>

      {message && (
        <p className={`font-bold ${message.ok ? "text-green-700" : "text-amber-700"}`}>{message.text}</p>
      )}

      <div className="flex flex-wrap gap-2">
        {found.map((w) => (
          <span key={w} className="bg-olive-gold text-white rounded-full px-4 py-1 font-bold">
            {w} 🫒
          </span>
        ))}
      </div>

      <BigButton
        variant="primary"
        disabled={found.length < 3}
        onClick={() => onComplete(activity.points, { found })}
      >
        أنهيت ({found.length}/3 كلمات على الأقل)
      </BigButton>
    </div>
  );
}
