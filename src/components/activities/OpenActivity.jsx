import { useState } from "react";
import BigButton from "../ui/BigButton.jsx";

export default function OpenActivity({ activity, onComplete }) {
  const { question, level } = activity.data;
  const [answer, setAnswer] = useState("");

  return (
    <div className="space-y-4">
      {level && <span className="inline-block bg-olive-cream border border-olive-green/30 rounded-full px-3 py-1 text-sm text-olive-trunk">{level}</span>}
      <p className="text-xl font-bold">{question}</p>
      <textarea
        className="w-full rounded-xl border-2 border-olive-green/30 p-4 text-lg min-h-32"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="اكتب إجابتك هنا..."
      />
      <BigButton
        variant="primary"
        disabled={answer.trim().length === 0}
        onClick={() => onComplete(activity.points, { answer })}
      >
        أرسل إجابتي ✅
      </BigButton>
    </div>
  );
}
