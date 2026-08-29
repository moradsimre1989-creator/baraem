import { useState } from "react";
import BigButton from "../ui/BigButton.jsx";

export default function MindmapActivity({ activity, onComplete }) {
  const { wordBank } = activity.data;
  const [rays, setRays] = useState([]);
  const [draft, setDraft] = useState("");
  const [usedWords, setUsedWords] = useState([]);

  const addRay = () => {
    if (!draft.trim()) return;
    setRays((r) => [...r, draft.trim()]);
    setDraft("");
  };

  const addWordFromBank = (word) => {
    if (usedWords.includes(word)) return;
    setRays((r) => [...r, word]);
    setUsedWords((w) => [...w, word]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-56 h-56">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-olive-gold text-white rounded-full w-32 h-32 flex items-center justify-center text-center font-bold text-lg p-2 shadow-lg z-10">
              {activity.data.prompt}
            </div>
          </div>
          {rays.map((ray, i) => {
            const angle = (i / Math.max(rays.length, 1)) * 2 * Math.PI;
            const x = 100 * Math.cos(angle);
            const y = 100 * Math.sin(angle);
            return (
              <div
                key={i}
                className="absolute bg-white border-2 border-olive-green rounded-xl px-2 py-1 text-sm font-bold shadow animate-[fadeIn_0.4s_ease-out]"
                style={{
                  top: `calc(50% + ${y}px - 16px)`,
                  left: `calc(50% + ${x}px - 40px)`,
                  width: "80px",
                  textAlign: "center",
                }}
              >
                {ray}
              </div>
            );
          })}
        </div>
      </div>

      {wordBank ? (
        <div className="flex flex-wrap justify-center gap-2">
          {wordBank.map((word) => (
            <button
              key={word}
              onClick={() => addWordFromBank(word)}
              disabled={usedWords.includes(word)}
              className={`rounded-full px-4 py-2 font-bold border-2 transition-all duration-200 ${
                usedWords.includes(word)
                  ? "bg-olive-green/10 border-olive-green/20 text-olive-trunk/50"
                  : "bg-white border-olive-green text-olive-green hover:bg-olive-green hover:text-white"
              }`}
            >
              {word} 🌿
            </button>
          ))}
        </div>
      ) : (
        <div className="flex gap-3">
          <input
            className="flex-1 rounded-xl border-2 border-olive-green/30 p-3 text-lg"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addRay()}
            placeholder="اكتب فكرة جديدة..."
          />
          <BigButton variant="outline" className="!px-5 !py-2" onClick={addRay}>
            أضف شعاعاً ✨
          </BigButton>
        </div>
      )}

      <BigButton
        variant="primary"
        disabled={rays.length < activity.data.minRays}
        onClick={() => onComplete(activity.points, { rays })}
      >
        أنهيت ({rays.length}/{activity.data.minRays} أشعّة)
      </BigButton>
    </div>
  );
}
