import { useState } from "react";
import BigButton from "../ui/BigButton.jsx";

export default function SortActivity({ activity, onComplete }) {
  const { instruction, categories, items } = activity.data;
  const [choices, setChoices] = useState({});
  const [checked, setChecked] = useState(false);

  const pick = (label, category) => {
    setChoices((c) => ({ ...c, [label]: category }));
    setChecked(false);
  };

  const allChosen = items.every((it) => choices[it.label]);
  const correctCount = items.filter((it) => choices[it.label] === it.category).length;
  const allCorrect = checked && correctCount === items.length;

  return (
    <div className="space-y-5">
      <p className="text-olive-trunk">{instruction}</p>
      <div className="space-y-3">
        {items.map((item) => {
          const chosen = choices[item.label];
          const isCorrect = checked && chosen === item.category;
          const isWrong = checked && chosen && chosen !== item.category;
          return (
            <div
              key={item.label}
              className={`flex items-center justify-between rounded-xl border-2 p-3 ${
                isCorrect ? "border-green-400 bg-green-50" : isWrong ? "border-amber-400 bg-amber-50" : "border-olive-green/20 bg-white"
              }`}
            >
              <span className="text-xl font-bold">{item.label}</span>
              <div className="flex gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => pick(item.label, cat)}
                    className={`px-4 py-2 rounded-lg border-2 font-bold ${
                      chosen === cat ? "bg-olive-gold text-white border-olive-gold" : "bg-white border-olive-green/30"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-3">
        <BigButton variant="outline" disabled={!allChosen} onClick={() => setChecked(true)}>
          تحقق ({correctCount}/{items.length})
        </BigButton>
        {allCorrect && (
          <BigButton variant="primary" onClick={() => onComplete(activity.points, { choices })}>
            أنهيت 🎉
          </BigButton>
        )}
      </div>
    </div>
  );
}
