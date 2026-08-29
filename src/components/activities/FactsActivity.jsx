import { altFor } from "../../data/photoCredits.js";
import { useState } from "react";
import BigButton from "../ui/BigButton.jsx";

export default function FactsActivity({ activity, onComplete }) {
  const { cards } = activity.data;
  const [revealed, setRevealed] = useState([]);

  const reveal = (i) => setRevealed((r) => (r.includes(i) ? r : [...r, i]));
  const allRevealed = revealed.length === cards.length;

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        {cards.map((card, i) => {
          const isOpen = revealed.includes(i);
          return (
            <button
              key={i}
              onClick={() => reveal(i)}
              className={`text-right rounded-2xl border p-5 transition-all duration-300 ${
                isOpen ? "bg-olive-cream border-olive-green/30" : "bg-white border-black/10 hover:border-olive-green"
              }`}
            >
              {card.image ? (
                <img src={card.image} alt={card.word ? `صورة: ${card.word}` : altFor(card.image)} loading="lazy" decoding="async" className="w-full h-28 object-cover rounded-xl mb-2" />
              ) : (
                <div className="text-3xl mb-2">{card.emoji}</div>
              )}
              {isOpen ? (
                <>
                  {card.word && <p className="font-black text-lg text-olive-green mb-1">{card.word}</p>}
                  <p className="text-sm leading-relaxed">{card.fact}</p>
                </>
              ) : (
                <p className="font-bold text-olive-green">
                  {card.word ? `💎 ${card.word} — اضغط لتكتشف المعنى` : "💡 هل تعلم؟ اضغط لتكتشف"}
                </p>
              )}
            </button>
          );
        })}
      </div>
      <BigButton variant="primary" disabled={!allRevealed} onClick={() => onComplete(activity.points, { revealed })}>
        أنهيت ({revealed.length}/{cards.length}) 🎉
      </BigButton>
    </div>
  );
}
