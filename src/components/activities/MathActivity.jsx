import { useState } from "react";
import BigButton from "../ui/BigButton.jsx";
import FeedbackBanner from "../ui/FeedbackBanner.jsx";
import { altFor } from "../../data/photoCredits.js";

export default function MathActivity({ activity, onComplete }) {
  const { question, answer, unitLabel, image, imageAlt } = activity.data;
  const [value, setValue] = useState("");
  const [status, setStatus] = useState(null);

  const check = () => {
    if (value.trim() === "") return;
    setStatus(value.trim() === String(answer) ? "correct" : "wrong");
  };

  return (
    <div className="space-y-5">
      {/* صورة حقيقية للمسألة: المسألة الكلامية المجرّدة تُتعب قارئاً مبتدئاً،
          والصورة تربط العدد بشيء يراه. اختيارية — من لا صورة له لا يتغيّر. */}
      {image && (
        <img
          src={image}
          alt={imageAlt ?? altFor(image)}
          loading="lazy"
          decoding="async"
          className="w-full h-48 object-cover rounded-2xl"
        />
      )}
      <p className="text-xl font-bold leading-relaxed">{question}</p>
      <div className="flex items-center gap-3">
        <input
          type="number"
          inputMode="numeric"
          className="w-32 rounded-xl border-2 border-olive-green/30 p-3 text-2xl text-center"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setStatus(null);
          }}
        />
        {unitLabel && <span className="text-lg text-olive-trunk">{unitLabel}</span>}
      </div>
      <FeedbackBanner status={status} correctText="أحسنت! الجواب صحيح 🎉" hintText="ليس هذا الجواب، حاول العد مرة أخرى" />
      <div className="flex gap-3">
        <BigButton variant="outline" onClick={check}>
          تحقق من إجابتي
        </BigButton>
        {status === "correct" && (
          <BigButton variant="primary" onClick={() => onComplete(activity.points, { value })}>
            التالي ✅
          </BigButton>
        )}
      </div>
    </div>
  );
}
