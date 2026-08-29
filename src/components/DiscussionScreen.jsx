import { useEffect, useRef, useState } from "react";
import BigButton from "./ui/BigButton.jsx";
import { discussionQuestions, feelingCards } from "../data/discussionQuestions.js";

function randomQuestion(excludeText) {
  const pool = discussionQuestions.filter((q) => q.text !== excludeText);
  return pool[Math.floor(Math.random() * pool.length)] || discussionQuestions[0];
}

const TIMER_SECONDS = 60;

export default function DiscussionScreen() {
  const [question, setQuestion] = useState(discussionQuestions[0]);
  const [vote, setVote] = useState(null);
  const [voteTally, setVoteTally] = useState({});
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

  const nextQuestion = () => {
    setQuestion(randomQuestion(question.text));
    setVote(null);
    setVoteTally({});
    setSeconds(TIMER_SECONDS);
    setRunning(false);
  };

  const castVote = (label) => {
    setVote(label);
    setVoteTally((t) => ({ ...t, [label]: (t[label] || 0) + 1 }));
  };

  const pickStudent = () => setStudentNumber(1 + Math.floor(Math.random() * 30));

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-16 pt-6 space-y-5">
      <div className="text-center mb-2">
        <h1 className="text-3xl font-black text-olive-ink">💬 مجلس الزيتونة</h1>
        <p className="text-olive-trunk mt-1">نقاش صفّي مبني على مستويات التفكير العليا</p>
      </div>

      <div className="bg-surface rounded-3xl border border-black/5 p-6 text-center" style={{ boxShadow: "var(--shadow-card)" }}>
        <span className="inline-block bg-olive-cream rounded-full px-4 py-1.5 font-bold text-sm mb-4">
          {question.level}
        </span>
        <p className="text-2xl font-bold leading-relaxed mb-6">{question.text}</p>
        <BigButton variant="gold" onClick={nextQuestion}>
          🔀 سؤال آخر
        </BigButton>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="bg-surface rounded-3xl border border-black/5 p-5" style={{ boxShadow: "var(--shadow-card)" }}>
          <h2 className="font-bold text-sm mb-3 text-olive-trunk">⏱️ مؤقّت النقاش</h2>
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

      <div className="bg-surface rounded-3xl border border-black/5 p-5" style={{ boxShadow: "var(--shadow-card)" }}>
        <h2 className="font-bold text-sm mb-3 text-olive-trunk">📊 تصويت الصف</h2>
        <div className="flex flex-wrap gap-3 justify-center">
          {feelingCards.map((label) => (
            <button
              key={label}
              onClick={() => castVote(label)}
              className={`rounded-2xl border px-4 py-3 font-bold transition-all duration-300 ${
                vote === label ? "bg-olive-green text-white border-olive-green" : "bg-white border-black/10 hover:border-olive-green"
              }`}
            >
              {label} {voteTally[label] ? `(${voteTally[label]})` : ""}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
