import { useRef, useState } from "react";
import BigButton from "../ui/BigButton.jsx";
import { speak, stopSpeaking, startRecording } from "../../utils/speech.js";
import { unit } from "../../data/units/zaytouna.js";
import { lookupWord } from "../../data/wordGlossary.js";
import { asset } from "../../utils/asset.js";

function WordPopup({ word, info, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-3xl p-6 max-w-xs w-full text-center space-y-3"
        style={{ boxShadow: "var(--shadow-hover)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-quran text-2xl font-bold text-olive-green">{word}</p>
        <p className="text-sm text-olive-trunk">
          <span className="font-bold text-olive-ink">المعنى: </span>
          {info.meaning}
        </p>
        <p className="text-sm text-olive-trunk">
          <span className="font-bold text-olive-ink">المرادف: </span>
          {info.synonym}
        </p>
        <p className="text-sm text-olive-trunk bg-olive-cream rounded-xl p-2">
          <span className="font-bold text-olive-ink">مثال: </span>
          {info.example}
        </p>
        <BigButton variant="outline" className="!px-4 !py-2 text-sm" onClick={onClose}>
          إغلاق
        </BigButton>
      </div>
    </div>
  );
}

function ClickableText({ text, onWordClick }) {
  const words = text.split(" ");
  return words.map((w, i) => {
    const info = lookupWord(w);
    return (
      <span
        key={i}
        onClick={(e) => {
          e.stopPropagation();
          if (info) onWordClick(w, info);
        }}
        className={info ? "border-b-2 border-dotted border-olive-gold cursor-pointer" : ""}
      >
        {w}{" "}
      </span>
    );
  });
}

export default function ReadActivity({ activity, onComplete }) {
  const [playingLine, setPlayingLine] = useState(null);
  const [recording, setRecording] = useState(false);
  const [recordedLines, setRecordedLines] = useState({});
  const [recorderRef, setRecorderRef] = useState(null);
  const [speed, setSpeed] = useState("normal");
  const [favorite, setFavorite] = useState(null);
  const [activeWord, setActiveWord] = useState(null);
  const poemAudioRef = useRef(null);

  const playLine = (index, sadr, ajuz) => {
    setPlayingLine(index);
    speak(`${sadr} ${ajuz}`, "ar-SA", speed === "slow" ? 0.5 : 0.85);
    setTimeout(() => setPlayingLine(null), speed === "slow" ? 4000 : 2500);
  };

  /* القصيدة كاملة بصوت جمانة — تسجيل بشري لا نطقاً آلياً. محرّك النطق لا
     يضبط وزن الشعر ولا مدّ القافية، والطفل في الصف الثاني يتعلّم الإلقاء
     بالتقليد. التسجيل يبقى مصدر الصوت الوحيد هنا؛ والنطق الآلي باقٍ لقراءة
     البيت المفرد حيث يخدم التدريب لا الإلقاء. */
  const toggleWholePoem = () => {
    const audio = poemAudioRef.current;
    if (!audio) return;
    if (playingLine === "all") {
      audio.pause();
      audio.currentTime = 0;
      setPlayingLine(null);
      return;
    }
    stopSpeaking(); // لا يجتمع صوتان
    audio.currentTime = 0;
    audio.play().catch(() => setPlayingLine(null));
    setPlayingLine("all");
  };

  const toggleRecord = async (index) => {
    if (recording === index) {
      const url = await recorderRef.stop();
      setRecordedLines((prev) => ({ ...prev, [index]: url }));
      setRecording(false);
      setRecorderRef(null);
      return;
    }
    try {
      const rec = await startRecording();
      setRecorderRef(rec);
      setRecording(index);
    } catch {
      alert("تعذّر الوصول إلى الميكروفون. تأكد من السماح باستخدامه.");
    }
  };

  const readCount = Object.keys(recordedLines).length;
  const onWordClick = (word, info) => setActiveWord({ word, info });

  return (
    <div className="space-y-4">
      <p className="text-olive-trunk">{activity.data.instruction}</p>
      <p className="text-xs text-olive-trunk">💡 الكلمات المسطّرة بنقاط قابلة للضغط لمعرفة معناها.</p>

      <div className="flex gap-2">
        <button
          onClick={() => setSpeed("normal")}
          className={`rounded-xl px-3 py-1.5 text-sm font-bold border ${
            speed === "normal" ? "bg-olive-green text-white border-olive-green" : "bg-white border-black/10"
          }`}
        >
          ▶ قراءة طبيعية
        </button>
        <button
          onClick={() => setSpeed("slow")}
          className={`rounded-xl px-3 py-1.5 text-sm font-bold border ${
            speed === "slow" ? "bg-olive-green text-white border-olive-green" : "bg-white border-black/10"
          }`}
        >
          🐢 قراءة بطيئة
        </button>
      </div>

      {/*
        القصيدة كاملة في كتلة واحدة قبل البطاقات: الطالب يحتاج أن يرى النصّ
        مجتمعاً ليحسّ وزنه وقافيته — والبطاقات وحدها تقطّعه إلى ستّ قطع.
        البطاقات تبقى تحتها للعمل بيتاً بيتاً: تشغيلاً وتسجيلاً واختياراً.
      */}
      <div
        className="rounded-3xl border-2 border-olive-green/25 bg-olive-cream p-5 sm:p-6"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h3 className="font-black text-olive-ink text-xl">
            📜 {unit.text.title} — القصيدة كاملة
          </h3>
          <BigButton
            variant={playingLine === "all" ? "gold" : "outline"}
            className="!px-4 !py-2 text-base"
            onClick={toggleWholePoem}
          >
            {playingLine === "all" ? "⏹ إيقاف" : "🔊 استمع إلى القصيدة كاملة"}
          </BigButton>
          {/* مشغّل ظاهر أيضاً: المعلّمة قد تريد الإرجاع إلى بيت بعينه أو
              إعادة مقطع، والزرّ وحده لا يتيح ذلك. */}
          <audio
            ref={poemAudioRef}
            src={asset("/audio/zaytouna-poem-jumana.m4a")}
            controls
            preload="metadata"
            onEnded={() => setPlayingLine(null)}
            onPause={() => setPlayingLine((p) => (p === "all" ? null : p))}
            onPlay={() => setPlayingLine("all")}
            className="h-10 w-full sm:w-64"
            aria-label="القصيدة كاملة بصوت جمانة"
          />
        </div>

        <div className="space-y-2 text-center">
          {unit.text.lines.map((line, i) => (
            <p key={i} className="font-quran text-2xl sm:text-3xl leading-relaxed">
              <ClickableText text={line.sadr} onWordClick={onWordClick} />
              <span className="text-olive-green mx-1">،</span>
              <ClickableText text={line.ajuz} onWordClick={onWordClick} />
            </p>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {unit.text.lines.map((line, i) => (
          <div
            key={i}
            className={`rounded-2xl border-2 p-4 transition ${
              playingLine === i
                ? "border-olive-gold bg-amber-50"
                : favorite === i
                ? "border-olive-green bg-olive-green/5"
                : "border-olive-green/20 bg-white"
            }`}
          >
            <p className="font-quran text-2xl leading-relaxed mb-3">
              <ClickableText text={line.sadr} onWordClick={onWordClick} /> <span className="text-olive-green">،</span>{" "}
              <ClickableText text={line.ajuz} onWordClick={onWordClick} />
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <BigButton variant="outline" className="!px-4 !py-2 text-base" onClick={() => playLine(i, line.sadr, line.ajuz)}>
                🔊 تشغيل صوتي للبيت
              </BigButton>
              <BigButton
                variant={recording === i ? "gold" : "outline"}
                className="!px-4 !py-2 text-base"
                onClick={() => toggleRecord(i)}
              >
                {recording === i ? "⏹ إيقاف التسجيل" : "🎙 سجّل قراءتك"}
              </BigButton>
              <button
                onClick={() => setFavorite(favorite === i ? null : i)}
                className="text-2xl"
                aria-label="البيت المفضّل"
                title="اختر البيت المفضّل"
              >
                {favorite === i ? "⭐" : "☆"}
              </button>
              {recordedLines[i] && <audio controls src={recordedLines[i]} className="h-10" />}
            </div>
          </div>
        ))}
      </div>

      {activeWord && (
        <WordPopup word={activeWord.word} info={activeWord.info} onClose={() => setActiveWord(null)} />
      )}

      <BigButton
        variant="primary"
        disabled={readCount === 0}
        onClick={() => onComplete(activity.points, { recordedCount: readCount, favorite })}
      >
        أنهيت القراءة ({readCount}/{unit.text.lines.length} أبيات مسجّلة)
      </BigButton>
    </div>
  );
}
