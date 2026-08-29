import { useState } from "react";
import BigButton from "../ui/BigButton.jsx";

export default function FindWordActivity({ activity, onComplete }) {
  const { verseText, targetWord } = activity.data;
  const words = verseText.split(" ");
  const [found, setFound] = useState(false);
  const [wrongWord, setWrongWord] = useState(null);

  const clickWord = (w) => {
    const clean = w.replace(/[،.]/g, "");
    if (clean === targetWord) {
      setFound(true);
    } else {
      setWrongWord(w);
      setTimeout(() => setWrongWord(null), 500);
    }
  };

  return (
    <div className="space-y-6 text-center">
      <p className="text-olive-trunk">
        ابحث عن كلمة: <span className="font-black text-olive-green text-xl">{targetWord}</span>
      </p>
      <p className="font-quran text-2xl leading-loose bg-olive-cream rounded-2xl p-6">
        {words.map((w, i) => (
          <span
            key={i}
            onClick={() => !found && clickWord(w)}
            className={`cursor-pointer transition-all duration-200 rounded-lg px-0.5 ${
              found && w.replace(/[،.]/g, "") === targetWord
                ? "bg-olive-green text-white"
                : wrongWord === w
                  ? "bg-amber-200"
                  : "hover:bg-olive-green/10"
            }`}
          >
            {w}{" "}
          </span>
        ))}
      </p>
      {found && <p className="text-green-700 font-bold text-lg">⭐ وجدتها!</p>}
      <BigButton variant="primary" disabled={!found} onClick={() => onComplete(activity.points, { found })}>
        أنهيت ✅
      </BigButton>
    </div>
  );
}
