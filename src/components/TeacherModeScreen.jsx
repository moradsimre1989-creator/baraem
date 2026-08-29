import { useEffect, useRef, useState } from "react";
import BigButton from "./ui/BigButton.jsx";
import { unit } from "../data/units/zaytouna.js";
import { speak, stopSpeaking } from "../utils/speech.js";

const TIMER_SECONDS = 60;

export default function TeacherModeScreen() {
  const [fontSize, setFontSize] = useState(28);
  const [speaking, setSpeaking] = useState(false);
  const [seconds, setSeconds] = useState(TIMER_SECONDS);
  const [running, setRunning] = useState(false);
  const [studentNumber, setStudentNumber] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const playAll = () => {
    setSpeaking(true);
    let i = 0;
    const speakNext = () => {
      if (i >= unit.text.lines.length) {
        setSpeaking(false);
        return;
      }
      const line = unit.text.lines[i];
      speak(`${line.sadr} ${line.ajuz}`, "ar-SA");
      i += 1;
      setTimeout(speakNext, 3200);
    };
    speakNext();
  };

  const stop = () => {
    stopSpeaking();
    setSpeaking(false);
  };

  const pickStudent = () => setStudentNumber(1 + Math.floor(Math.random() * 30));

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-16 pt-6 space-y-5">
      <div className="text-center mb-2">
        <h1 className="text-3xl font-black text-olive-ink">🧑‍🏫 وضع المعلّمة</h1>
        <p className="text-olive-trunk mt-1">أدوات عرض جاهزة لاستخدام اللوح الذكي أمام الصف</p>
      </div>

      <div className="bg-surface rounded-3xl border border-black/5 p-6" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="font-bold text-sm text-olive-trunk">📖 عرض القصيدة كاملة</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFontSize((f) => Math.max(18, f - 4))}
              className="w-9 h-9 rounded-lg bg-olive-cream border border-black/10 font-bold"
            >
              A-
            </button>
            <button
              onClick={() => setFontSize((f) => Math.min(48, f + 4))}
              className="w-9 h-9 rounded-lg bg-olive-cream border border-black/10 font-bold"
            >
              A+
            </button>
            {speaking ? (
              <BigButton variant="outline" className="!px-4 !py-2 text-sm" onClick={stop}>
                ⏹ إيقاف الصوت
              </BigButton>
            ) : (
              <BigButton variant="outline" className="!px-4 !py-2 text-sm" onClick={playAll}>
                🔊 تشغيل الصوت
              </BigButton>
            )}
          </div>
        </div>
        <div className="font-quran space-y-3 text-center" style={{ fontSize: `${fontSize}px`, lineHeight: 1.9 }}>
          {unit.text.lines.map((l, i) => (
            <p key={i}>
              {l.sadr} <span className="text-olive-green">،</span> {l.ajuz}
            </p>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="bg-surface rounded-3xl border border-black/5 p-5" style={{ boxShadow: "var(--shadow-card)" }}>
          <h2 className="font-bold text-sm mb-3 text-olive-trunk">⏱️ مؤقّت</h2>
          <div className="text-4xl font-black text-center mb-4 tabular-nums">
            {String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}
          </div>
          <div className="flex gap-2 justify-center">
            <BigButton variant="outline" className="!px-4 !py-2 text-sm" onClick={() => setRunning((r) => !r)}>
              {running ? "⏸ إيقاف" : "▶ تشغيل"}
            </BigButton>
            <BigButton
              variant="outline"
              className="!px-4 !py-2 text-sm"
              onClick={() => {
                setSeconds(TIMER_SECONDS);
                setRunning(false);
              }}
            >
              🔁 إعادة
            </BigButton>
          </div>
        </div>
        <div className="bg-surface rounded-3xl border border-black/5 p-5 text-center" style={{ boxShadow: "var(--shadow-card)" }}>
          <h2 className="font-bold text-sm mb-3 text-olive-trunk">🎲 اختيار طالب عشوائي</h2>
          <div className="text-4xl font-black mb-4">{studentNumber ? `#${studentNumber}` : "—"}</div>
          <BigButton variant="outline" className="!px-4 !py-2 text-sm" onClick={pickStudent}>
            اختر الآن
          </BigButton>
        </div>
      </div>
    </div>
  );
}
