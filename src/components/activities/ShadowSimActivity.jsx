import { useState } from "react";
import BigButton from "../ui/BigButton.jsx";
import FeedbackBanner from "../ui/FeedbackBanner.jsx";

export default function ShadowSimActivity({ activity, onComplete }) {
  const { instruction, question, options, answerIndex } = activity.data;
  const [time, setTime] = useState(50);
  const [moved, setMoved] = useState(false);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState(null);

  // time: 0 (شروق) → 50 (ظهر) → 100 (غروب)
  const distanceFromNoon = Math.abs(50 - time); // 0..50
  const sunX = 20 + (time / 100) * 180; // 20..200
  const sunY = 20 + (distanceFromNoon / 50) * 55; // higher near noon (lower y)
  const shadowLength = 10 + (distanceFromNoon / 50) * 55; // short at noon, long at edges
  const shadowDir = time < 50 ? 1 : -1; // sun on right at sunrise (low x)? shadow opposite side
  const shadowX = 110 + shadowDir * (shadowLength / 2);

  const check = () => {
    if (selected === null) return;
    setStatus(selected === answerIndex ? "correct" : "wrong");
  };

  const canFinish = moved && status === "correct";

  return (
    <div className="space-y-5">
      <p className="text-olive-trunk">{instruction}</p>

      <svg viewBox="0 0 220 130" className="w-full max-w-sm mx-auto bg-sky-50 rounded-2xl">
        <circle cx={sunX} cy={sunY} r="12" fill="#e3a93b" />
        <line x1="0" y1="100" x2="220" y2="100" stroke="#c9974a" strokeWidth="2" />
        <ellipse cx={shadowX} cy="101" rx={Math.max(6, shadowLength / 2)} ry="4" fill="#2c2a1f" opacity="0.35" />
        <path d="M110 100 L110 55" stroke="#8a6a4a" strokeWidth="8" strokeLinecap="round" />
        <circle cx="110" cy="40" r="26" fill="#3cae79" />
      </svg>

      <div className="max-w-sm mx-auto">
        <input
          type="range"
          min="0"
          max="100"
          value={time}
          onChange={(e) => {
            setTime(Number(e.target.value));
            setMoved(true);
          }}
          className="w-full accent-olive-green"
        />
        <div className="flex justify-between text-xs text-olive-trunk mt-1">
          <span>🌅 شروق</span>
          <span>☀️ ظهر</span>
          <span>🌇 غروب</span>
        </div>
      </div>

      <div className="border-t border-black/5 pt-5 space-y-3">
        <p className="text-lg font-bold text-center">{question}</p>
        <div className="grid gap-2 max-w-sm mx-auto">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => {
                setSelected(i);
                setStatus(null);
              }}
              className={`rounded-xl border-2 p-3 font-bold transition ${
                selected === i ? "bg-olive-gold text-white border-olive-gold" : "bg-white border-olive-green/30"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        <FeedbackBanner status={status} correctText="صحيح! الظل أقصر ما يكون عند الظهر." hintText="حرّك المؤشّر وجرّب مرة أخرى" />
        <div className="flex justify-center gap-3">
          <BigButton variant="outline" onClick={check} disabled={selected === null}>
            تحقق من إجابتي
          </BigButton>
          {canFinish && (
            <BigButton variant="primary" onClick={() => onComplete(activity.points, { time, selected })}>
              أنهيت ✅
            </BigButton>
          )}
        </div>
      </div>
    </div>
  );
}
