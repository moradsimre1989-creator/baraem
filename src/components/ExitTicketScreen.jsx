import { useState } from "react";
import BigButton from "./ui/BigButton.jsx";

export default function ExitTicketScreen({ existing, onSave }) {
  const [learned, setLearned] = useState(existing?.learned || "");
  const [question, setQuestion] = useState(existing?.question || "");
  const [liked, setLiked] = useState(existing?.liked || "");
  const [saved, setSaved] = useState(false);

  const save = () => {
    onSave({ learned, question, liked, at: Date.now() });
    setSaved(true);
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 pb-16 pt-6 space-y-5">
      <div className="text-center mb-2">
        <h1 className="text-3xl font-black text-olive-ink">🍃 بطاقة الخروج</h1>
        <p className="text-olive-trunk mt-1">قبل أن نختم رحلتنا مع الزيتونة اليوم</p>
      </div>

      <div className="bg-surface rounded-3xl border border-black/5 p-6 space-y-5" style={{ boxShadow: "var(--shadow-card)" }}>
        <div>
          <label className="font-bold block mb-2 text-sm">🌱 اليوم تعلّمت...</label>
          <textarea
            className="w-full rounded-2xl border border-black/10 p-3 text-base min-h-20 focus:outline focus:outline-2 focus:outline-olive-green/40"
            value={learned}
            onChange={(e) => setLearned(e.target.value)}
          />
        </div>
        <div>
          <label className="font-bold block mb-2 text-sm">❓ سؤال بقي في ذهني...</label>
          <textarea
            className="w-full rounded-2xl border border-black/10 p-3 text-base min-h-20 focus:outline focus:outline-2 focus:outline-olive-green/40"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>
        <div>
          <label className="font-bold block mb-2 text-sm">❤️ أكثر نشاط أحببته...</label>
          <textarea
            className="w-full rounded-2xl border border-black/10 p-3 text-base min-h-20 focus:outline focus:outline-2 focus:outline-olive-green/40"
            value={liked}
            onChange={(e) => setLiked(e.target.value)}
          />
        </div>
        <BigButton variant="primary" className="w-full" onClick={save}>
          {saved ? "تم الحفظ ✅" : "احفظ بطاقتي"}
        </BigButton>
      </div>
    </div>
  );
}
