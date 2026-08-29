import { useState } from "react";
import BigButton from "./ui/BigButton.jsx";

const SELF_RATING_ITEMS = [
  { id: "fluency", label: "أقرأ بطلاقة" },
  { id: "understanding", label: "أفهم النص" },
  { id: "opinion", label: "أعبّر عن رأيي" },
];

export default function SummaryScreen({ domain, existing, onSave }) {
  const [learned, setLearned] = useState(existing?.learned || "");
  const [liked, setLiked] = useState(existing?.liked || "");
  const [ratings, setRatings] = useState(existing?.ratings || {});
  const [saved, setSaved] = useState(false);

  const setRating = (id, value) => setRatings((r) => ({ ...r, [id]: value }));

  const handleSave = () => {
    onSave({ learned, liked, ratings, at: Date.now() });
    setSaved(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-16 pt-6">
      <div className="bg-surface rounded-3xl border border-black/5 p-6 space-y-6" style={{ boxShadow: "var(--shadow-card)" }}>
        <h1 className="text-2xl font-black text-center" style={{ color: domain.color }}>
          📝 التلخيص والإجمال
        </h1>

        <div>
          <label className="font-bold block mb-2 text-sm">ماذا تعلّمت؟</label>
          <textarea
            className="w-full rounded-2xl border border-black/10 p-3 text-base min-h-24 focus:outline focus:outline-2 focus:outline-olive-green/40"
            value={learned}
            onChange={(e) => setLearned(e.target.value)}
          />
        </div>

        <div>
          <label className="font-bold block mb-2 text-sm">ما أكثر ما أعجبك؟</label>
          <textarea
            className="w-full rounded-2xl border border-black/10 p-3 text-base min-h-24 focus:outline focus:outline-2 focus:outline-olive-green/40"
            value={liked}
            onChange={(e) => setLiked(e.target.value)}
          />
        </div>

        <div>
          <p className="font-bold mb-3">أقيّم نفسي:</p>
          <div className="space-y-3">
            {SELF_RATING_ITEMS.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <span>{item.label}</span>
                <div className="flex gap-1">
                  {[1, 2, 3].map((n) => (
                    <button
                      key={n}
                      onClick={() => setRating(item.id, n)}
                      className="text-2xl"
                      aria-label={`${n} من 3`}
                    >
                      {n <= (ratings[item.id] || 0) ? "🫒" : "⚪"}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <BigButton variant="primary" className="w-full" onClick={handleSave}>
          {saved ? "تم الحفظ ✅" : "احفظ تلخيصي"}
        </BigButton>
      </div>
    </div>
  );
}
