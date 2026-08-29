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

export default function OrderActivity({ activity, onComplete }) {
  const { instruction, items } = activity.data;
  const [order, setOrder] = useState(() => shuffle(items));
  const [checked, setChecked] = useState(false);

  const move = (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= order.length) return;
    const next = [...order];
    [next[index], next[target]] = [next[target], next[index]];
    setOrder(next);
    setChecked(false);
  };

  const isCorrectOrder = order.every((item, i) => item.id === items[i].id);

  return (
    <div className="space-y-5">
      <p className="text-olive-trunk">{instruction}</p>
      <div className="space-y-2">
        {order.map((item, i) => {
          const correctSpot = checked && item.id === items[i].id;
          const wrongSpot = checked && item.id !== items[i].id;
          return (
            <div
              key={item.id}
              className={`flex items-center justify-between rounded-xl border-2 p-3 ${
                correctSpot ? "bg-green-50 border-green-400" : wrongSpot ? "bg-amber-50 border-amber-400" : "bg-white border-olive-green/30"
              }`}
            >
              <span className="text-lg font-bold">
                {i + 1}. {item.label}
              </span>
              <div className="flex gap-1">
                <button onClick={() => move(i, -1)} className="w-9 h-9 rounded-lg bg-olive-cream border border-olive-green/30 text-lg">
                  ⬆
                </button>
                <button onClick={() => move(i, 1)} className="w-9 h-9 rounded-lg bg-olive-cream border border-olive-green/30 text-lg">
                  ⬇
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-3">
        <BigButton variant="outline" onClick={() => setChecked(true)}>
          تحقق من الترتيب
        </BigButton>
        {checked && isCorrectOrder && (
          <BigButton variant="primary" onClick={() => onComplete(activity.points, { order })}>
            أنهيت 🎉
          </BigButton>
        )}
      </div>
    </div>
  );
}
