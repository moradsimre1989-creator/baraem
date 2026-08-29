import { useState } from "react";
import BigButton from "../ui/BigButton.jsx";
import FeedbackBanner from "../ui/FeedbackBanner.jsx";
import ListenButton from "../ui/ListenButton.jsx";
import { speak } from "../../utils/speech.js";
import { altFor } from "../../data/photoCredits.js";

export default function McqActivity({ activity, onComplete }) {
  const { question, options, answerIndex, level, audioText, audioLang, emojiVisual, image, imageAlt } = activity.data;
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState(null);
  const [attempts, setAttempts] = useState(0);

  const check = () => {
    if (selected === null) return;
    setAttempts((n) => n + 1);
    setStatus(selected === answerIndex ? "correct" : "wrong");
  };

  return (
    <div className="space-y-5">
      {level && <span className="inline-block bg-olive-cream border border-olive-green/30 rounded-full px-3 py-1 text-sm text-olive-trunk">{level}</span>}
      {image && (
        <img
          src={image}
          alt={imageAlt ?? altFor(image)}
          loading="lazy"
          decoding="async"
          className="w-full h-48 object-cover rounded-2xl"
        />
      )}
      {!image && emojiVisual && (
        <div className="text-6xl text-center bg-olive-cream rounded-2xl py-6" aria-hidden>
          {emojiVisual}
        </div>
      )}
      <p className="text-xl font-bold">{question}</p>
      <div className="flex flex-wrap gap-3">
        {/* قراءة السؤال نفسه — متاحة في كل سؤال، لا في الأسئلة الصوتية وحدها */}
        <ListenButton text={question} label="اقرأ السؤال" size="sm" />
        {audioText && (
          <button
            onClick={() => speak(audioText, audioLang || "ar-SA")}
            className="inline-flex items-center gap-2 rounded-full border border-olive-green/30 bg-white px-4 py-2 font-bold text-olive-green hover:border-olive-green transition"
          >
            🔊 استمع
          </button>
        )}
      </div>
      <div className="space-y-2">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => {
              setSelected(i);
              setStatus(null);
            }}
            className={`w-full text-right rounded-xl border-2 p-4 text-lg transition ${
              selected === i ? "bg-olive-gold text-white border-olive-gold" : "bg-white border-olive-green/30 hover:border-olive-green"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      <FeedbackBanner status={status} attempts={attempts} />
      <div className="flex gap-3">
        <BigButton variant="outline" onClick={check} disabled={selected === null}>
          تحقق من إجابتي
        </BigButton>
        {status === "correct" && (
          <BigButton variant="primary" onClick={() => onComplete(activity.points, { selected })}>
            التالي ✅
          </BigButton>
        )}
      </div>
    </div>
  );
}
