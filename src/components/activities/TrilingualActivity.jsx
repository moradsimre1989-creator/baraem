import { altFor } from "../../data/photoCredits.js";
import { useState } from "react";
import BigButton from "../ui/BigButton.jsx";
import { speak } from "../../utils/speech.js";

const LANGS = [
  { key: "ar", lang: "ar-SA", label: "🇦 عربي" },
  { key: "he", lang: "he-IL", label: "🇮 עברית" },
  { key: "en", lang: "en-US", label: "🇬 English" },
];

export default function TrilingualActivity({ activity, onComplete }) {
  const { instruction, cards } = activity.data;
  const [heard, setHeard] = useState(new Set());

  const playCard = (index, langKey, lang, text) => {
    speak(text, lang);
    setHeard((prev) => new Set(prev).add(index));
  };

  const allHeard = heard.size === cards.length;

  return (
    <div className="space-y-4">
      <p className="text-olive-trunk">{instruction}</p>
      <div className="grid sm:grid-cols-2 gap-4">
        {cards.map((card, i) => (
          <div
            key={i}
            className={`rounded-2xl border-2 p-4 text-center ${
              heard.has(i) ? "border-green-400 bg-green-50" : "border-olive-green/20 bg-white"
            }`}
          >
            {card.image ? (
              <img src={card.image} alt={altFor(card.image)} loading="lazy" decoding="async" className="w-full h-24 object-cover rounded-xl mb-2" />
            ) : (
              <div className="text-4xl mb-2">{card.emoji}</div>
            )}
            <div className="flex flex-col gap-2">
              {LANGS.map(({ key, lang, label }) => (
                <button
                  key={key}
                  onClick={() => playCard(i, key, lang, card[key])}
                  className="flex items-center justify-between rounded-xl border-2 border-olive-green/30 px-3 py-2 hover:border-olive-green"
                >
                  <span className="font-bold">{card[key]}</span>
                  <span className="text-sm text-olive-trunk">🔊 {label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <BigButton variant="primary" disabled={!allHeard} onClick={() => onComplete(activity.points, { heard: [...heard] })}>
        أنهيت ({heard.size}/{cards.length} بطاقات)
      </BigButton>
    </div>
  );
}
