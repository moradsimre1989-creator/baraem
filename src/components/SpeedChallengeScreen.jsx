import { useEffect, useRef, useState } from "react";
import BigButton from "./ui/BigButton.jsx";
import { speedChallengeQuestions } from "../data/speedChallenge.js";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const DURATION = 60;

export default function SpeedChallengeScreen() {
  const [pool, setPool] = useState(() => shuffle(speedChallengeQuestions));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [seconds, setSeconds] = useState(DURATION);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [flash, setFlash] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            setFinished(true);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const start = () => {
    setPool(shuffle(speedChallengeQuestions));
    setIndex(0);
    setScore(0);
    setSeconds(DURATION);
    setFinished(false);
    setRunning(true);
  };

  const answer = (i) => {
    if (!running) return;
    const correct = i === pool[index].answerIndex;
    setFlash(correct ? "correct" : "wrong");
    if (correct) setScore((s) => s + 1);
    setTimeout(() => {
      setFlash(null);
      setIndex((idx) => (idx + 1) % pool.length);
    }, 350);
  };

  const current = pool[index];

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 pb-16 pt-6 space-y-5">
      <div className="text-center mb-2">
        <h1 className="text-3xl font-black text-olive-ink">⚡ تحدي 60 ثانية</h1>
        <p className="text-olive-trunk mt-1">أجب عن أكبر عدد من الأسئلة قبل انتهاء الوقت</p>
      </div>

      <div className="bg-surface rounded-3xl border border-black/5 p-6 text-center" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="flex items-center justify-between mb-6">
          <span className="text-lg font-black tabular-nums">⏱️ {seconds}s</span>
          <span className="text-lg font-black text-olive-green">🫒 {score}</span>
        </div>

        {!running && !finished && (
          <div className="py-10">
            <BigButton variant="primary" onClick={start}>
              ▶ ابدأ التحدي
            </BigButton>
          </div>
        )}

        {running && current && (
          <div className={`transition-colors duration-200 rounded-2xl ${flash === "correct" ? "bg-green-50" : flash === "wrong" ? "bg-amber-50" : ""}`}>
            <p className="text-xl font-bold mb-5 py-3">{current.question}</p>
            <div className="grid gap-2">
              {current.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => answer(i)}
                  disabled={Boolean(flash)}
                  className="rounded-xl border-2 border-olive-green/30 bg-white p-3 font-bold hover:border-olive-green transition disabled:opacity-60"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {finished && (
          <div className="py-6 space-y-4">
            <div className="text-5xl">🏆</div>
            <p className="text-2xl font-black">نتيجتك: {score} 🫒</p>
            <BigButton variant="primary" onClick={start}>
              🔁 حاول مرة أخرى
            </BigButton>
          </div>
        )}
      </div>
    </div>
  );
}
