import { useState } from "react";
import BigButton from "../ui/BigButton.jsx";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function RandomPromptActivity({ activity, onComplete }) {
  const { prompts, boxEmoji, instruction, minPrompts } = activity.data;
  const [order] = useState(() => shuffle(prompts));
  const [index, setIndex] = useState(-1);
  const [seenCount, setSeenCount] = useState(0);

  const openNext = () => {
    setIndex((i) => (i + 1) % order.length);
    setSeenCount((c) => c + 1);
  };

  const needed = minPrompts || Math.min(4, prompts.length);
  const done = seenCount >= needed;

  return (
    <div className="space-y-6 text-center">
      <p className="text-olive-trunk">{instruction}</p>

      {index === -1 ? (
        <button
          onClick={openNext}
          className="mx-auto flex flex-col items-center justify-center gap-2 w-40 h-40 rounded-3xl bg-pastel-yellow text-6xl transition-transform duration-300 hover:scale-105 active:scale-95"
        >
          {boxEmoji || "🎁"}
        </button>
      ) : (
        <div className="bg-pastel-yellow rounded-3xl p-8 min-h-40 flex items-center justify-center">
          <p className="text-xl font-black text-olive-ink">{order[index]}</p>
        </div>
      )}

      <BigButton variant="outline" onClick={openNext}>
        {index === -1 ? `افتح ${boxEmoji || "🎁"}` : "🎲 سؤال جديد"}
      </BigButton>

      <p className="text-xs text-olive-trunk">
        ({Math.min(seenCount, needed)}/{needed})
      </p>

      <BigButton variant="primary" disabled={!done} onClick={() => onComplete(activity.points, { seenCount })}>
        أنهينا 🎉
      </BigButton>
    </div>
  );
}
