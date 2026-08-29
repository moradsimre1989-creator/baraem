import { useState } from "react";
import BigButton from "../ui/BigButton.jsx";

export default function NumberBuildActivity({ activity, onComplete }) {
  const { instruction, targetTens, targetOnes } = activity.data;
  const [tens, setTens] = useState(0);
  const [ones, setOnes] = useState(0);
  const target = targetTens * 10 + targetOnes;
  const current = tens * 10 + ones;
  const isCorrect = tens === targetTens && ones === targetOnes;

  return (
    <div className="space-y-6 text-center">
      <p className="text-olive-trunk">{instruction}</p>
      <p className="text-lg font-bold">
        ابنِ العدد: <span className="text-2xl text-olive-green">{target}</span>
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-olive-cream rounded-2xl p-4">
          <p className="font-bold text-sm text-olive-trunk mb-2">عشرات 🧺</p>
          <div className="flex flex-wrap justify-center gap-1 min-h-12 mb-2">
            {Array.from({ length: tens }).map((_, i) => (
              <span key={i} className="text-2xl">🧺</span>
            ))}
          </div>
          <div className="flex justify-center gap-2">
            <button onClick={() => setTens((t) => Math.max(0, t - 1))} className="w-9 h-9 rounded-lg bg-white border border-olive-green/30 text-lg">−</button>
            <button onClick={() => setTens((t) => Math.min(9, t + 1))} className="w-9 h-9 rounded-lg bg-olive-green text-white text-lg">+</button>
          </div>
        </div>
        <div className="bg-olive-cream rounded-2xl p-4">
          <p className="font-bold text-sm text-olive-trunk mb-2">آحاد 🫒</p>
          <div className="flex flex-wrap justify-center gap-1 min-h-12 mb-2">
            {Array.from({ length: ones }).map((_, i) => (
              <span key={i} className="text-2xl">🫒</span>
            ))}
          </div>
          <div className="flex justify-center gap-2">
            <button onClick={() => setOnes((o) => Math.max(0, o - 1))} className="w-9 h-9 rounded-lg bg-white border border-olive-green/30 text-lg">−</button>
            <button onClick={() => setOnes((o) => Math.min(9, o + 1))} className="w-9 h-9 rounded-lg bg-olive-green text-white text-lg">+</button>
          </div>
        </div>
      </div>

      <p className="text-sm text-olive-trunk">
        {tens} × 10 + {ones} = <span className="font-black text-olive-ink">{current}</span>
      </p>

      <BigButton variant="primary" disabled={!isCorrect} onClick={() => onComplete(activity.points, { tens, ones })}>
        {isCorrect ? `لقد بنيت العدد ${target}! ⭐` : "تحقق من العدد"}
      </BigButton>
    </div>
  );
}
