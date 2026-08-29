import { asset } from "../../utils/asset.js";
import { useState } from "react";
import BigButton from "../ui/BigButton.jsx";
import { speak, stopSpeaking } from "../../utils/speech.js";

export default function StoryActivity({ activity, onComplete }) {
  const { paragraphs, reflection, narrationAudio, narratorName, title, isQuran } = activity.data;
  const [speaking, setSpeaking] = useState(false);
  const [answer, setAnswer] = useState("");

  const playAll = () => {
    setSpeaking(true);
    speak(paragraphs.join(" "), "ar-SA", 0.85);
    const estMs = paragraphs.join(" ").length * 90;
    setTimeout(() => setSpeaking(false), estMs);
  };

  const stop = () => {
    stopSpeaking();
    setSpeaking(false);
  };

  return (
    <div className="space-y-5">
      {title && <p className="text-xl font-bold text-center">{title}</p>}

      {narrationAudio ? (
        <div className="text-center space-y-2">
          <p className="text-xs text-olive-trunk">🎙️ استمع للقصة {narratorName ? `بصوت ${narratorName}` : "بصوت القارئ"}</p>
          <audio controls src={asset(narrationAudio)} className="w-full" />
        </div>
      ) : (
        <div className="flex justify-end">
          {speaking ? (
            <BigButton variant="outline" className="!px-4 !py-2 text-sm" onClick={stop}>
              ⏹ إيقاف
            </BigButton>
          ) : (
            <BigButton variant="outline" className="!px-4 !py-2 text-sm" onClick={playAll}>
              🔊 استمع للقصة
            </BigButton>
          )}
        </div>
      )}

      <div
        className={`space-y-4 bg-olive-cream rounded-2xl p-5 leading-loose ${
          isQuran ? "font-quran text-2xl text-center border-2 border-olive-gold/30" : "text-lg"
        }`}
      >
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {reflection && (
        <div className="border-t border-black/5 pt-5 space-y-3">
          <p className="text-lg font-bold">{reflection}</p>
          <textarea
            className="w-full rounded-xl border-2 border-olive-green/30 p-3 text-base min-h-24"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="اكتب إجابتك هنا..."
          />
        </div>
      )}

      <BigButton
        variant="primary"
        disabled={reflection ? answer.trim().length === 0 : false}
        onClick={() => onComplete(activity.points, { answer })}
      >
        أنهيت القصة ✅
      </BigButton>
    </div>
  );
}
