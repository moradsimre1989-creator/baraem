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

export default function MemoryActivity({ activity, onComplete }) {
  const { instruction, pairs } = activity.data;

  const cards = useMemo(() => {
    const list = pairs.flatMap((p, i) => [
      { key: `${i}-a`, pairId: i, text: p.left },
      { key: `${i}-b`, pairId: i, text: p.right },
    ]);
    return shuffle(list);
  }, [pairs]);

  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [busy, setBusy] = useState(false);

  const flip = (index) => {
    if (busy || flipped.includes(index) || matched.includes(cards[index].pairId)) return;
    const next = [...flipped, index];
    setFlipped(next);
    if (next.length === 2) {
      setBusy(true);
      const [a, b] = next;
      if (cards[a].pairId === cards[b].pairId) {
        setTimeout(() => {
          setMatched((m) => [...m, cards[a].pairId]);
          setFlipped([]);
          setBusy(false);
        }, 500);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setBusy(false);
        }, 900);
      }
    }
  };

  const allMatched = matched.length === pairs.length;

  return (
    <div className="space-y-5">
      <p className="text-olive-trunk">{instruction}</p>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {cards.map((card, i) => {
          const isOpen = flipped.includes(i) || matched.includes(card.pairId);
          return (
            <button
              key={card.key}
              onClick={() => flip(i)}
              className={`aspect-square rounded-2xl border-2 flex items-center justify-center text-center p-2 text-sm font-bold transition-all duration-300 ${
                matched.includes(card.pairId)
                  ? "bg-green-50 border-green-300 text-green-800"
                  : isOpen
                  ? "bg-olive-gold text-white border-olive-gold"
                  : "bg-olive-green text-white border-olive-green hover:brightness-95"
              }`}
            >
              {isOpen ? card.text : "🫒"}
            </button>
          );
        })}
      </div>
      <BigButton variant="primary" disabled={!allMatched} onClick={() => onComplete(activity.points, { matched })}>
        أنهيت ({matched.length}/{pairs.length} أزواج) 🎉
      </BigButton>
    </div>
  );
}
