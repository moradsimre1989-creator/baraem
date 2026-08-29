import { useMemo, useState } from "react";
import BigButton from "../ui/BigButton.jsx";

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function MatchActivity({ activity, onComplete }) {
  const { pairs, instruction } = activity.data;
  const rightItems = useMemo(() => shuffle(pairs.map((p) => p.right)), [pairs]);
  const imageByRight = useMemo(() => Object.fromEntries(pairs.filter((p) => p.rightImage).map((p) => [p.right, p.rightImage])), [pairs]);

  const [selectedLeft, setSelectedLeft] = useState(null);
  const [matched, setMatched] = useState({});
  const [wrongFlash, setWrongFlash] = useState(null);

  const handleLeftClick = (left) => {
    if (matched[left]) return;
    setSelectedLeft(left);
  };

  const handleRightClick = (right) => {
    if (!selectedLeft) return;
    const correctPair = pairs.find((p) => p.left === selectedLeft);
    if (correctPair.right === right) {
      setMatched((m) => ({ ...m, [selectedLeft]: right }));
      setSelectedLeft(null);
    } else {
      setWrongFlash(right);
      setTimeout(() => setWrongFlash(null), 600);
    }
  };

  const isRightUsed = (right) => Object.values(matched).includes(right);
  const allMatched = Object.keys(matched).length === pairs.length;

  return (
    <div className="space-y-5">
      <p className="text-olive-trunk">{instruction}</p>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          {pairs.map((p) => (
            <button
              key={p.left}
              onClick={() => handleLeftClick(p.left)}
              disabled={Boolean(matched[p.left])}
              className={`w-full rounded-xl border-2 p-3 text-lg font-bold transition ${
                matched[p.left]
                  ? "bg-green-100 border-green-400 text-green-800"
                  : selectedLeft === p.left
                  ? "bg-olive-gold text-white border-olive-gold"
                  : "bg-white border-olive-green/30 hover:border-olive-green"
              }`}
            >
              {p.left}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {rightItems.map((right) => (
            <button
              key={right}
              onClick={() => handleRightClick(right)}
              disabled={isRightUsed(right)}
              className={`w-full rounded-xl border-2 p-2 text-lg transition ${
                isRightUsed(right)
                  ? "bg-green-100 border-green-400 text-green-800"
                  : wrongFlash === right
                  ? "bg-amber-100 border-amber-400"
                  : "bg-white border-olive-green/30 hover:border-olive-green"
              }`}
            >
              {imageByRight[right] ? (
                <span className="flex items-center justify-center gap-2">
                  <img src={imageByRight[right]} alt={right} loading="lazy" decoding="async" className="w-14 h-14 object-cover rounded-lg" />
                  <span>{right}</span>
                </span>
              ) : (
                right
              )}
            </button>
          ))}
        </div>
      </div>
      <BigButton
        variant="primary"
        disabled={!allMatched}
        onClick={() => onComplete(activity.points, { matched })}
      >
        أنهيت ({Object.keys(matched).length}/{pairs.length})
      </BigButton>
    </div>
  );
}
