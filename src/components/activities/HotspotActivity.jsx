import { altFor } from "../../data/photoCredits.js";
import { useMemo, useState } from "react";
import BigButton from "../ui/BigButton.jsx";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function HotspotActivity({ activity, onComplete }) {
  const { instruction, hotspots, bgImage } = activity.data;
  const order = useMemo(() => shuffle(hotspots), [hotspots]);
  const [step, setStep] = useState(0);
  const [found, setFound] = useState([]);
  const [wrongId, setWrongId] = useState(null);

  const target = order[step];
  const done = step >= order.length;

  const click = (spot) => {
    if (found.includes(spot.id)) return;
    if (spot.id === target.id) {
      setFound((f) => [...f, spot.id]);
      setStep((s) => s + 1);
    } else {
      setWrongId(spot.id);
      setTimeout(() => setWrongId(null), 500);
    }
  };

  return (
    <div className="space-y-5">
      <p className="text-olive-trunk">{instruction}</p>

      {!done ? (
        <p className="text-xl font-bold text-center">
          اضغط على: <span className="text-olive-green">{target.label}</span>
        </p>
      ) : (
        <p className="text-xl font-bold text-center text-green-700">أحسنت! حدّدت كل أجزاء الشجرة 🎉</p>
      )}

      {bgImage ? (
        <div className="relative w-full max-w-md mx-auto rounded-2xl overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
          <img src={bgImage} alt={altFor(bgImage, "شجرة زيتون حقيقية")} loading="lazy" decoding="async" className="w-full h-72 sm:h-80 object-cover" />
          {hotspots.map((spot) => {
            const isFound = found.includes(spot.id);
            const isWrong = wrongId === spot.id;
            return (
              <button
                key={spot.id}
                onClick={() => click(spot)}
                style={{ top: `${spot.y}%`, left: `${spot.x}%`, transform: "translate(-50%, -50%)" }}
                className={`absolute w-8 h-8 rounded-full border-2 border-white flex items-center justify-center font-bold text-white transition-colors ${
                  isFound ? "bg-green-500" : isWrong ? "bg-red-500" : "bg-olive-gold/90 hover:bg-olive-gold"
                }`}
              >
                {isFound ? "✓" : ""}
              </button>
            );
          })}
        </div>
      ) : (
        <svg viewBox="0 0 220 220" className="w-full max-w-xs mx-auto">
          <ellipse cx="110" cy="150" rx="70" ry="8" fill="#2fa36b" opacity="0.1" />
          <path d="M110 150 L110 60" stroke="#8a6a4a" strokeWidth="12" strokeLinecap="round" />
          <path d="M110 150 Q90 175 75 195" stroke="#8a6a4a" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M110 150 Q130 175 145 195" stroke="#8a6a4a" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M110 95 L80 70" stroke="#8a6a4a" strokeWidth="7" strokeLinecap="round" />
          <path d="M110 85 L145 65" stroke="#8a6a4a" strokeWidth="7" strokeLinecap="round" />
          <circle cx="110" cy="45" r="42" fill="#3cae79" />
          <circle cx="75" cy="60" r="26" fill="#2fa36b" />
          <circle cx="150" cy="58" r="28" fill="#2fa36b" />
          <circle cx="95" cy="65" r="4" fill="#e3a93b" />
          <circle cx="128" cy="50" r="4" fill="#c9974a" />
          <circle cx="140" cy="75" r="4" fill="#e3a93b" />

          {hotspots.map((spot) => {
            const isFound = found.includes(spot.id);
            const isWrong = wrongId === spot.id;
            return (
              <g key={spot.id} onClick={() => click(spot)} style={{ cursor: "pointer" }}>
                <circle
                  cx={spot.x}
                  cy={spot.y}
                  r="10"
                  fill={isFound ? "#22c55e" : isWrong ? "#ef4444" : "#c68a2e"}
                  stroke="white"
                  strokeWidth="2"
                />
                {isFound && (
                  <text x={spot.x} y={spot.y + 4} textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">
                    ✓
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      )}

      {found.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center">
          {hotspots
            .filter((s) => found.includes(s.id))
            .map((s) => (
              <span key={s.id} className="bg-green-50 text-green-800 rounded-full px-3 py-1 text-sm font-bold">
                ✓ {s.label}
              </span>
            ))}
        </div>
      )}

      <BigButton variant="primary" disabled={!done} onClick={() => onComplete(activity.points, { found })}>
        أنهيت ({found.length}/{hotspots.length}) 🎉
      </BigButton>
    </div>
  );
}
