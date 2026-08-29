import { useMemo, useState } from "react";
import BigButton from "../ui/BigButton.jsx";
import { unit } from "../../data/units/zaytouna.js";

function normalize(str) {
  return (str || "")
    .replace(/[ً-ٰٟـ]/g, "")
    .replace(/\s+/g, "")
    .trim();
}

const LEVEL_LABELS = ["المستوى 1: أكمل الكلمة الأخيرة", "المستوى 2: أكمل عجز البيت", "المستوى 3: اكتب البيت كاملاً"];

export default function MemorizeActivity({ activity, onComplete }) {
  const [level, setLevel] = useState(1);
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);

  const lines = unit.text.lines;

  const prompts = useMemo(() => {
    return lines.map((line) => {
      if (level === 1) {
        const words = line.ajuz.split(" ");
        const lastWord = words[words.length - 1];
        const shown = words.slice(0, -1).join(" ");
        return { visible: `${line.sadr}  ${shown} ____`, expected: lastWord };
      }
      if (level === 2) {
        return { visible: `${line.sadr}  ______`, expected: line.ajuz };
      }
      return { visible: "______  ______", expected: `${line.sadr} ${line.ajuz}` };
    });
  }, [level, lines]);

  const handleCheck = () => setChecked(true);

  const correctCount = prompts.filter((p, i) => normalize(answers[i]) === normalize(p.expected)).length;

  const nextLevel = () => {
    setLevel((l) => Math.min(3, l + 1));
    setAnswers({});
    setChecked(false);
  };

  return (
    <div className="space-y-4">
      <p className="text-olive-trunk font-bold">{LEVEL_LABELS[level - 1]}</p>
      <div className="space-y-3">
        {prompts.map((p, i) => {
          const isCorrect = checked && normalize(answers[i]) === normalize(p.expected);
          const isWrong = checked && !isCorrect;
          return (
            <div key={i} className="rounded-2xl border-2 border-olive-green/20 bg-white p-4">
              <p className="font-quran text-xl mb-2">{p.visible}</p>
              <input
                className={`w-full rounded-xl border-2 p-3 text-lg ${
                  isCorrect ? "border-green-400 bg-green-50" : isWrong ? "border-amber-400 bg-amber-50" : "border-olive-green/30"
                }`}
                value={answers[i] || ""}
                onChange={(e) => setAnswers((a) => ({ ...a, [i]: e.target.value }))}
                placeholder="اكتب هنا من حفظك..."
              />
              {isWrong && <p className="text-amber-700 mt-2">الصحيح: {p.expected}</p>}
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-3">
        <BigButton variant="outline" onClick={handleCheck}>
          تحقق ({correctCount}/{prompts.length})
        </BigButton>
        {checked && level < 3 && (
          <BigButton variant="gold" onClick={nextLevel}>
            المستوى التالي ⬅
          </BigButton>
        )}
        {checked && level === 3 && (
          <BigButton variant="primary" onClick={() => onComplete(activity.points, { correctCount, level })}>
            أنهيت الحفظ 🎉
          </BigButton>
        )}
      </div>
    </div>
  );
}
